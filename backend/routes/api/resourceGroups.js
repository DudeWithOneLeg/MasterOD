const express = require('express')
const router = express.Router()

const { ResourceGroup, GroupResources, Result } = require('../../db/models')
const { Op } = require('@sequelize/core')
const sequelize = require('sequelize')

router.post('/single', async (req, res) => {
    const { resourceGroupId, shareUrl } = req.body
    const { id: userId } = req.user

    const query = { where: {} }

    resourceGroupId ? (query.where.id = resourceGroupId) : (query.where.shareUrl = shareUrl)

    const group = await ResourceGroup.findOne(query)
    const resources = []

    const resourceIds = await GroupResources.findAll({
        where: {
            groupId: group.id,
            userId
        },
        attributes: ['resourceId'],
        group: ['resourceId']
    })

    const { numberResources } = resourceIds[0].dataValues

    for (let resourceId of resourceIds) {
        const resource = await Result.findByPk(resourceId.resourceId)
        resources.push(resource)
    }

    res.json({ group: { ...group.dataValues, numberResources }, resources }).status(200)
})

router.post('/new', async (req, res) => {
    const { resources: resourceIds, group: resourceGroup } = req.body
    const { id } = req.user
    const { name, description, isPrivate } = resourceGroup
    const newGroup = { userId: id, name, description, isPrivate }
    const group = await ResourceGroup.create(newGroup)
    const shareUrl = btoa(`${id} ${group.id}`)
    await group.update({ shareUrl })

    resourceIds.map(async resourceId => {
        await GroupResources.create({ userId: id, resourceId, groupId: group.id })
    })

    res.json({ resourceGroupId: group.id }).status(200)

})

router.patch('/:resourceGroupId/resources', async (req, res) => {
    const response = {}
    const { resourceGroupId: id } = req.params
    const { id: userId } = req.user

    const { resources, action } = req.body

    const group = await ResourceGroup.findOne({
        where: {
            id,
            userId: userId,
        }
    })

    if (action === 'delete') {
        await GroupResources.destroy({
            where: {
                id: resources,
                userId
            }
        })
    }

    else if (action === 'add') {
        response.group = group
        response.resources = []
        resources.map(async resourceId => {
            const newResource = await GroupResources.create({resourceId, userId, groupId: group.id})
            response.resources.push(newResource)
        })
    }
    // const newResources = []

    // const resourceIds = await GroupResources.findAll({
    //     where: {
    //         groupId: group.id,
    //         userId
    //     },
    //     attributes: ['resourceId'],
    //     group: ['resourceId']
    // })

    // const { numberResources } = resourceIds[0].dataValues

    // for (let resourceId of resourceIds) {
    //     const resource = await Result.findByPk(resourceId.resourceId)
    //     newResources.push(resource)
    // }

    res.json({ success: true}).status(200)

})

router.delete('/:resourceGroupId/resources', async (req, res) => {
    const response = {}
    const { resourceGroupId: groupId } = req.params
    const { id: userId } = req.user

    const { resourceIds } = req.body

    await GroupResources.destroy({
        where: {
            id: resourceIds,
            groupId,
            userId
        }
    })

    res.json(response).status(200)

})

router.patch('/:groupId', async (req, res) => {
    const { groupId: id } = req.params
    const { id: userId } = req.user
    const { name, description, isPrivate } = req.body

    const group = await ResourceGroup.findOne({
        where: {
            id,
            userId
        }
    })

    const newGroup = await group.update({ name, description, isPrivate })

    res.json(newGroup).status(200)

})

router.post('/', async (req, res) => {
    const { id: userId } = req.user
    const { limit, isPrivate, filterInput } = req.body
    const options = {
        where: {
            userId,
            [Op.or]: [
                { name: { [Op.like]: `%${filterInput}%` } },
                { description: { [Op.like]: `%${filterInput}%` } },
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
        const { numberResources } = count[0].dataValues
        groups.push({ ...group.dataValues, numberResources })
    }

    res.json(groups).status(200)

})

module.exports = router
