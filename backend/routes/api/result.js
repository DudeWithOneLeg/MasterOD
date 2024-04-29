const express = require("express");
const router = express.Router();
const { Result } = require("../../db/models");

router.get("/", async (req, res) => {
  const { id: userId } = req.user;

  const savedResults = await Result.findAll({
    where: {
      userId,
    },
    limit: 5,
  });

  return res.json(savedResults);
});

router.post("/", async (req, res) => {
  const { newResult } = req;
  const { id: userId } = req.user;
  await Result.create({ ...newResult, userId });

  const savedResults = await Result.findAll({
    where: {
      userId,
    },
    limit: 5,
  });

  res.status(200)
  return res.json(savedResults);
});

module.exports = router;
