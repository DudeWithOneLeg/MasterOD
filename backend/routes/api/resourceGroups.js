const express = require('express')
const router = express.Router()

const {ResourceGroup, GroupResources} = require('../../db/models')

router.post('/', async (req, res) => {
    const { resources } = req.body
    console.log(req.user)
    const {id} = req.user

    const resourceGroup = await ResourceGroup.create({userId: id})
    const newGroup = {
        group,
        resources: []
    }

    console.log(btoa(resourceGroup.id))

    resources.map(async resource => {
        const newResource = await GroupResources.create({...resource, userId: id})
        newGroup.resources.push(newResource)
    })

    await res.json(newGroup).status(200)

})

router.patch('/:resourceGroupId', async (req, res) => {
    const response = {}
    const { resourceGroupId } = req.params
    const {id: userId} = req.user

    const {newResources} = req.body

    const resourceGroup = await ResourceGroup.findOne({
        where: {
            id: resourceGroupId,
            userId: userId,
        }
    })

    if (resourceGroup) {
        response.group = resourceGroup
        response.resources = []
        newResources.map(async resource => {
            const newResource = await GroupResources.create(resource, userId)
            response.resources.push(newResource)
        })
    }

    await res.json(response).status(200)

})

module.exports = router
