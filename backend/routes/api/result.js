const express = require("express");
const router = express.Router();
const { Result, BrowseHistory } = require("../../db/models");

router.get("/", async (req, res) => {
  if (req.user) {

    const { id: userId } = req.user;

    const history = await BrowseHistory.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']]
    });

    const saved = await Result.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']]
    });

    res.statusCode = 200
    return res.json({history, saved});
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

    res.statusCode = 200
    return res.json(savedResults);
  }
});

router.get("/history", async (req, res) => {
  if (req.user) {

    const { id: userId } = req.user;

    const browseHistory = await BrowseHistory.findAll({
      where: {
        userId,
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.statusCode = 200
    return res.json(browseHistory);
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

