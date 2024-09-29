const express = require('express')
const router = express.Router()
const { getClosestArchive } = require('./utils')

router.post('/', async (req, res) => {
    // console.log(getArchvive)
    const { url } = req.body
    const data = await getClosestArchive(url)
    // console.log(data)
    return res.json(data)
})

module.exports = router
