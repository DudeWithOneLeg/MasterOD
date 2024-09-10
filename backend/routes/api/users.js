
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Queries } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
async function verify(token) {
  await User.sync().catch(err => console.log(err))
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.access_token}`);
  console.log(token)

    if (!response.ok) {
      return false
    }

    const data = await response.json();

  return data;
}

const validateSignup = [
  // check('email')
  //   .exists({ checkFalsy: true })
  //   .isEmail()
  //   .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const router = express.Router();

// Restore session user
router.get(
  '/',
  async (req, res) => {
    const { user } = req;
    const recentQueries = await Queries.findAll({
      where: {
        userId : user.id,
      },
      order: [['updatedAt', 'DESC']],
      limit: 10
    })
    if (user) {
      const safeUser = {
        id: user.id,
        // email: user.email,
        username: user.username,
        recentQueries
      };

      res.statusCode = 200
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null }).status(200)
  }
);

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { password, username, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ username, hashedPassword, email });

    const safeUser = {
      id: user.id,
      // email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    res.statusCode = 200
    return res.json({
      user: safeUser
    }).status(200)
  }
);

router.post('/google', async (req, res) => {
  const {token} = req.body

  const {email, sub} = await verify(token)
  const hashedPassword = bcrypt.hashSync(sub);
  const newUser = { hashedPassword, email: email, isOauth:true}

  const user = await User.create(newUser).catch(err => console.log(err))
  await user.update({email: email, isOauth: true})
  if (!user.email) {
    return res.json()
  }
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username
  };

  await setTokenCookie(res, safeUser);

    res.statusCode = 200
    return res.json({
      user: safeUser
    }).status(200)

})

module.exports = router;
