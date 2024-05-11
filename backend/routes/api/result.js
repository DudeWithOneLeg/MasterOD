const express = require("express");
const router = express.Router();
const { Result, BrowseHistory } = require("../../db/models");

router.get("/recent", async (req, res) => {
  if (req.user) {

    const { id: userId } = req.user;

    const savedResults = await BrowseHistory.findAll({
      where: {
        userId,
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    return res.json(savedResults);
  }
});

router.get("/saved", async (req, res) => {
  if (req.user) {

    const { id: userId } = req.user;

    const savedResults = await Result.findAll({
      where: {
        userId,
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    return res.json(savedResults);
  }
});

router.post("/save", async (req, res) => {
  const newResult  = req.body;
  const { id: userId } = req.user;
  await Result.create({ ...newResult, userId });

  const savedResults = await Result.findAll({
      where: {
          userId,
        },
        limit: 5,
        order: [['createdAt', 'DESC']]
    });
    // console.log(savedResults)

  res.statusCode = 200
  return res.json(savedResults);
});

module.exports = router;
