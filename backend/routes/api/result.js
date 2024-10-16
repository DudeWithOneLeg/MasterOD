const express = require("express");
const router = express.Router();
const { Result } = require("../../db/models");
const { Op } = require('@sequelize/core')

router.post("/", async (req, res) => {
  if (req.user) {
    const { id: userId } = req.user;
    const {filter, limit, saved} = req.body
    const options = {
      where: {
        userId,
        saved
      },
      order: [["createdAt", "DESC"]],
      limit
    }
    if (filter) {
      options.where = {
        userId: req.user.id,
        [Op.or] : [
          {title: {[Op.like]: `%${filter}%`}},
          {snippet: {[Op.like]: `%${filter}%`}},
          {link: {[Op.like]: `%${filter}%`}}
        ]
      }
    }
    const results = await Result.findAll(options);
    res.statusCode = 200;
    return res.json({ results }).status(200);
  }
});

router.get("/saved", async (req, res) => {
  if (req.user) {
    const { id: userId } = req.user;

    const savedResults = await Result.findAll({
      where: {
        userId,
        saved: true,
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
    });


    res.statusCode = 200;
    return res.json(savedResults).status(200);
  }
});

router.get("/history", async (req, res) => {
  if (req.user) {
    const { id: userId } = req.user;

    const browseHistory = await Result.findAll({
      where: {
        userId,
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    console.log()

    res.statusCode = 200;
    return res.json(browseHistory).status(200);
  }
});

router.post("/save", async (req, res) => {
  const newResult = req.body;
  const { id: userId } = req.user;
  await Result.create({ ...newResult, userId, saved: true });

  const savedResults = await Result.findAll({
    where: {
      userId,
      saved: true,
    },
    limit: 5,
    order: [["createdAt", "DESC"]],
  });
  // console.log(savedResults)

  res.statusCode = 200;
  return res.json(savedResults).status(200);
});

router.delete("/:resultId", async (req, res) => {
  const { resultId } = req.params;
  const {id: userId} = req.user
  const result = await Result.findOne({
    where: {
      id: resultId,
    },
  });

  await result.update({ saved: false });
  await result.save()

  console.log(result)
  const savedResults = await Result.findAll({
    where: {
      userId,
      saved: true,
    },
    limit: 5,
    order: [["createdAt", "DESC"]],
  });


  return res.json({savedResults, id: resultId}).status(200);
});

module.exports = router;
