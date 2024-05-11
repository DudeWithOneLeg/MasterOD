const express = require('express')
const router = express.Router()
const {Queries} = require('../../db/models')

router.get('/', async (req, res) => {

    const {user} = req

    const queries = await Queries.findAll({
        where: {
            userId: user.id
        }
    })
    res.json(queries)
})

router.get('/save', async (req, res) => {
    const { user } = req

    const savedQueries = await Queries.findAll({
      where: {
        userId: user.id,
        saved: true
      },
      order: [['updatedAt', 'DESC']],
      limit: 5
    })

    res.statusCode = 200
    res.json(savedQueries)

})

router.post('/save', async (req, res) => {
    const params = req.body;
    const { user } = req;
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
      saved: true
    };


    await Queries.create(newQuery);
    const recentSavedQueries = await Queries.findAll({
      where: {
        userId: user.id,
        saved: true
      },
      order: [['updatedAt', 'DESC']],
      limit: 5
    })

    res.statusCode = 200
    return res.json(recentSavedQueries)
  })

module.exports = router
