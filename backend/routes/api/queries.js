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

module.exports = router
