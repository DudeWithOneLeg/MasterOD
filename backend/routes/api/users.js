const express = require("express");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const { jwtConfig } = require('../../config');
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const formData = require('form-data');
const Mailgun = require('mailgun.js');

// Initialize Mailgun with your credentials
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY // Replace with your Mailgun API key
});
const { secret } = jwtConfig;

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Queries } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
async function verify(token) {
    await User.sync().catch((err) => console.log(err));
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.access_token}`
    );
    console.log(token);

    if (!response.ok) {
        return false;
    }

    const data = await response.json();

    return data;
}

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

const router = express.Router();

// Set up session middleware
router.use(session({
  secret: secret, // Change this to a secure secret key
  resave: false, // Prevents resaving session if no changes were made
  saveUninitialized: true, // Save a session even if it's uninitialized
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (over HTTPS)
    httpOnly: true, // Prevent access from JavaScript
    maxAge: 1000 * 60 * 10 // Session expiration time (10 minutes in this example)
  }
}));

// Restore session user
router.get("/", async (req, res) => {
    const { user } = req;
    const recentQueries = await Queries.findAll({
        where: {
            userId: user.id,
        },
        order: [["updatedAt", "DESC"]],
        limit: 10,
    });
    if (user) {
        const safeUser = {
            id: user.id,
            // email: user.email,
            username: user.username,
            recentQueries,
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
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        username,
        hashedPassword,
        email: email.toLowerCase() || null,
        isOauth: false,
    });

    const safeUser = {
        id: user.id,
        // email: user.email,
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
    const hashedPassword = bcrypt.hashSync(sub);
    const tempUser = { hashedPassword, email: email, isOauth: true };

    req.session.tempUser = tempUser

    await setTokenCookie(res, tempUser);

    return res
        .json({
            success: true,
        })
        .status(200);
});

router.patch("/google", async (req, res) => {
    const { username } = req.body;

    if (req.session.tempUser) {
      const {tempUser} = req.session
      const newUser = { ...tempUser, username };
      const user = await User.create(newUser);

      const safeUser = {
          id: user.id,
          username: user.username,
          email: user.email,
      };

      await setTokenCookie(res, safeUser);

      res.statusCode = 200;
      return res
          .json({
              user: safeUser,
          })
          .status(200);
    }

});

router.post('/feedback', async (req, res) => {
    const {text} = req.body
    console.log(text)
    const {user} = req
//     const msg = {
//         to: 'galvancromeo@gmail.com', // Change to your recipient
//         from: 'galvancromeo@gmail.com', // Change to your verified sender
//         subject: 'Sending with SendGrid is Fun',
//         text: `${text}\n\n UserID: ${user.id}\nUsername: ${user.username}`,
//       }
//       sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
mg.messages.create('sandboxd0cc1f63512e4e10ad574b7287636401.mailgun.org', {
    from: 'support@searchdeck.com',  // Sender's email
    to: ['galvancromeo@gmail.com'],  // Recipient's email
    subject: 'Feedback',
    text: `Message: ${text}\n\nUserID: ${user.id}\nUsername: ${user.username}`
  })
  .then((msg) => console.log(msg))  // Logs the response from Mailgun
  .catch((err) => console.error(err));  // Logs any error
  return res.json().status(200)
})

module.exports = router;
