const express = require("express");
const router = express.Router();
const { Queries } = require("../../db/models");
const { Op } = require('@sequelize/core')

router.post("/", async (req, res) => {
  const { user } = req;
  const { limit, filter } = req.body
  const filterOptions = {
    where: {
      userId: user.id,
      [Op.or] : [
        {query: {[Op.like]: `%${filter}%`}},
        {engine: {[Op.like]: `%${filter}%`}},
        {string: {[Op.like]: `%${filter}%`}}
      ]
    },
    order: [["createdAt", "DESC"]],
    limit
  }

  const queries = await Queries.findAll(filter ? filterOptions : {
    where: {
      userId: user.id,
    },
    order: [["createdAt", "DESC"]],
    limit
  });

  return res.json(queries).status(200);
});

router.post("/:queryId", async (req, res) => {
  const { queryId } = req.params;

  const query = await Queries.findByPk(queryId);
  query.update({
    saved: !query.saved,
  });
  return res.json(query).status(200);
});

router.get("/save", async (req, res) => {
  const { user } = req;

  const savedQueries = await Queries.findAll({
    where: {
      userId: user.id,
      saved: true,
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  return res.json(savedQueries).status(200);
});

router.post("/save", async (req, res) => {
  const params = req.body;
  const { user } = req;
  console.log(params)
  params.q = params.q
    .split(";")
    .map((q) =>
      q.includes(":")
        ? `${q.split(":")[0]}:"${q.split(":")[1]}"`
        : '"' + q + '"'
    )
    .join(" ");

  const newQuery = {
    userId: user.id,
    query: params.q,
    engine: params.engine,
    saved: true,
  };

  await Queries.create(newQuery);
  const recentSavedQueries = await Queries.findAll({
    where: {
      userId: user.id,
      saved: true,
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  res.statusCode = 200;
  return res.json(recentSavedQueries).status(200);
});

module.exports = router;
