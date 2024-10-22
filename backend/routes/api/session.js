const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

async function verify(token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.access_token}`);

    if (!response.ok) {
      return false
    }

    const data = await response.json();

  return data;
}

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

const router = express.Router();

router.get("/", async (req, res) => {

  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      isOauth: user.isOauth
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

router.post("/google", async (req, res, next) => {
  const { token } = req.body;
  const verified = await verify(token)

  if (!token || !verified) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "There was an error logging in." };
    return next(err);
  }

  const {email} = verified
  const user = await User.findOne({
    where: {
        email
    },
  });

  if (!user) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The credentials were invalid." };
    return next(err);
  }

  // console.log(recentQueries)

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    isOauth: user.isOauth
  };

  await setTokenCookie(res, safeUser);

  // res.setStatus = 200
  return res.json({
    user: safeUser,
  }).status(200)
});

router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.findOne({
    where: {
        [Op.or] : [
          {email: credential.toLowerCase()},
          {username: credential}
      ]
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    isOauth: user.isOauth
  };

  await setTokenCookie(res, safeUser);

  // res.setStatus = 200
  return res.json({
    user: safeUser,
  }).status(200)
});

router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" }).status(200)
});

module.exports = router;
