const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require('express-session');
const { jwtConfig } = require('../../config');
const { secret } = jwtConfig;
const { createClient } = require('redis')
const RedisStore = require("connect-redis").default
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const jwt = require('jsonwebtoken');
async function verify(token) {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.access_token}`
    ).catch(err => console.log(err))

    if (!response.ok) {
        console.log('FAILED', response)
        return false;
    }

    const data = await response.json();
    return data;
}

const redisClient = createClient({ url: process.env.REDIS_URL });
// redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
})

router.use(session({
    store: redisStore,
    secret: secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
        httpOnly: true, // Prevent JavaScript access to the cookie
        maxAge: 1000 * 60 * 5 // 5-minute expiration time
    }
}));
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Initialize Mailgun with your credentials
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY // Replace with your Mailgun API key
});

const validateSignup = [
    // check('email')
    // .exists({ checkFalsy: true })
    // .isEmail()
    // .withMessage('Please provide a valid email.'),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    handleValidationErrors,
];



// Restore session user
router.get("/", async (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            isOauth: user.isOauth
        };

        res.statusCode = 200;
        return res.json({
            user: safeUser,
        });
    } else return res.json({ user: null }).status(200);
});

// Sign up
router.post("/", validateSignup, async (req, res) => {
    const { password, username, email } = req.body;
    const existingUser = await User.findOne({
        where: {
            email
        }
    })

    if (existingUser) {
        return res.json({ errors: { email: "An account already exists with this email" } })
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        username,
        hashedPassword,
        email: email.toLowerCase() || null,
        isOauth: false,
    });

    const safeUser = {
        id: user.id,
        email: user.email,
        isOauth: user.isOauth,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    res.statusCode = 200;
    return res
        .json({
            user: safeUser,
        })
        .status(200);
});

router.post("/google", async (req, res) => {
    const { token } = req.body;
    const { email, sub } = await verify(token);

    if (!req.user) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            console.log(user)
            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                isOauth: user.isOauth
            }

            await setTokenCookie(res, safeUser);

            return res
                .json({ user: { ...safeUser } })
                .status(200);
        }
        else {
            const hashedPassword = bcrypt.hashSync(sub);
            const tempUser = { email: email, isOauth: true };

            await redisClient.set('tempUser', JSON.stringify({ ...tempUser, hashedPassword }), {
                EX: 60 * 5
            })
                .catch(err => console.log(err))

            await setTokenCookie(res, tempUser);

            return res
                .json({
                    success: true,
                })
                .status(200);
        }
    }
    else {
        const { id, username } = req.user
        const { email, sub } = await verify(token);
        const user = await User.findOne({
            where: {
                id,
                username
            }
        })
        const googleHashedPassword = bcrypt.hashSync(sub);
        const updated = { googleHashedPassword, isOauth: true, email }
        if (!user.email) updated.email = email
        await user.update(updated)
        return res
            .json({ user })
            .status(200);
    }

});

router.patch("/google", async (req, res) => {
    const { username } = req.body;
    let tempUser = await redisClient.get('tempUser')
    tempUser = JSON.parse(tempUser)
    if (tempUser) {
        const newUser = { ...tempUser, username };
        const user = await User.create(newUser);

        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        await setTokenCookie(res, safeUser);
        redisClient.del('tempUser')

        return res
            .json({
                user: safeUser,
            })
            .status(200);
    }

});

router.post('/feedback', async (req, res) => {
    const { text, email } = req.body
    console.log(text)
    const { user } = req
    mg.messages.create('sandboxd0cc1f63512e4e10ad574b7287636401.mailgun.org', {
        from: email || 'support@searchdeck.com',  // Sender's email
        to: ['galvancromeo@gmail.com'],  // Recipient's email
        subject: 'Feedback',
        text: `Message: ${text}\n\nUserID: ${user.id}\nUsername: ${user.username}`
    })
        .then((msg) => console.log(msg))  // Logs the response from Mailgun
        .catch((err) => console.error(err));  // Logs any error
    return res.json().status(200)
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body

    const url = process.env.NODE_ENV === 'production' ? 'https://search-deck.com' : 'http://localhost:3000'

    const user = await User.findOne({
        where: {
            email
        }
    })

    if (user) {
        const token = jwt.sign(
            { id: user.id, username: user.username }, // Payload/data to include in the token
            secret,                                  // Secret key to sign the token
            { expiresIn: 60 * 30 }                          // Options: Set token expiration time (optional)
        );
        mg.messages.create('support.search-deck.com', {
            from: 'support@search-deck.com',  // Sender's email
            to: [email],  // Recipient's email
            subject: 'Reset Password',
            template: "reset password",
            'h:X-Mailgun-Variables': { reset_link: `${url}/reset-password/${token}` }
        })
            .then((msg) => console.log(msg))  // Logs the response from Mailgun
            .catch((err) => console.error(err));  // Logs any error
    }

    return res.json().status(200)
})

router.post('/reset-password/verify', async (req, res) => {
    const { token } = req.body

    const { id, username } = jwt.verify(token, secret);

    const user = await User.findOne({
        where: {
            id,
            username
        }
    })

    // mg.messages.create('support.search-deck.com', {
    //     from: 'support@search-deck.com',  // Sender's email
    //     to: ['galvancromeo@gmail.com'],  // Recipient's email
    //     subject: 'Reset Password',
    //     text: `Message: tsting`
    // })
    //     .then((msg) => console.log(msg))  // Logs the response from Mailgun
    //     .catch((err) => console.error(err));  // Logs any error
    if (user) {
        return res.json({user: {username, email: user.email}, success: true}).status(200)
    }

})

router.post('/reset-password', async (req, res) => {
    const {email, username, password}  = req.body


    const validUser = await User.findOne({
        where: {
            username,
            email
        }
    })

    // mg.messages.create('support.search-deck.com', {
    //     from: 'support@search-deck.com',  // Sender's email
    //     to: ['galvancromeo@gmail.com'],  // Recipient's email
    //     subject: 'Reset Password',
    //     text: `Message: tsting`
    // })
    //     .then((msg) => console.log(msg))  // Logs the response from Mailgun
    //     .catch((err) => console.error(err));  // Logs any error
    if (validUser) {
        const hashedPassword = bcrypt.hashSync(password)
        await validUser.update({hashedPassword})
        return res.json({success: true}).status(200)
    }
    else {
        return res.json({error: "No user found"}).status(302)
    }

})

module.exports = router;
