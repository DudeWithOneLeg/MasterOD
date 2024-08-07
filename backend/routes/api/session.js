const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User, Queries, Result, BrowseHistory } = require("../../db/models");

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
      username: user.username
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }
  const recentQueries = await Queries.findAll({
    where: {
      userId: user.id,
    },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  const savedQueries = await Queries.findAll({
    where: {
      userId: user.id,
      saved: true,
    },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  // console.log(recentQueries)

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    recentQueries,
    savedQueries,
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
