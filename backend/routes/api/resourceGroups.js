const express = require('express')
const router = express.Router()

const {ResourceGroup, GroupResources, Result} = require('../../db/models')
const { Op } = require('@sequelize/core')
const sequelize = require('sequelize')

router.get('/:resourceGroupId', async (req, res) => {
    const {resourceGroupId} = req.params
    const {id: userId} = req.user

    const group = await ResourceGroup.findByPk(resourceGroupId)
    const resources = []

    const resourceIds = await GroupResources.findAll({
        where: {
            groupId: resourceGroupId,
            userId
        },
        attributes: ['resourceId']
    })

    for (let resourceId of resourceIds) {
        const resource = await Result.findByPk(resourceId.resourceId)
        resources.push(resource)
    }

    res.json({group, resources}).status(200)
})

router.post('/new', async (req, res) => {
    const { resources, group: resourceGroup } = req.body
    const {id} = req.user
    const {name, description, isPrivate} = resourceGroup
    const newGroup = {userId: id, name, description, isPrivate}
    const group = await ResourceGroup.create(newGroup)
    const shareUrl = isPrivate ? null : btoa(`${id} ${group.id}`)
    await group.update({shareUrl})

    resources.map(async resource => {
        await GroupResources.create({userId: id, resourceId: resource.id, groupId: group.id})
    })

    await res.json({resourceGroupId: group.id}).status(200)

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

router.post('/', async (req, res) => {
    const {id: userId} = req.user
    const {limit, isPrivate, filterInput} = req.body
    const options = {
        where: {
            userId,
            [Op.or] : [
                {name: {[Op.like] : `%${filterInput}%`}},
                {description: {[Op.like] : `%${filterInput}%`}},
            ]
        },
        limit,
    }

    if (isPrivate !== undefined) options.where.isPrivate = isPrivate

    const queryGroups = await ResourceGroup.findAll(options)
    const groups = []

    for (let group of queryGroups) {
        const count = await GroupResources.findAll({
            where: {
                groupId: group.id
            },
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'numberResources']]
        })
        const {numberResources} = count[0].dataValues
        groups.push({...group.dataValues, numberResources})
    }

    res.json(groups).status(200)

})

module.exports = router
