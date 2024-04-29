const express = require("express");
const router = express.Router();
const { Result } = require("../../db/models");

router.get('/', async (req, res) => {

    const {id: userId} = req.user

    const savedResults = await Result.findAll({
        where: {
            userId
        }
    })

    res.json(savedResults)

})

router.post('/', async (req, res) => {
    const {result} = req
    const {id: userId} = req.user

    const newResult = await Result.create({...result, userId})

    res.json(newResult)

})

module.exports = router;
