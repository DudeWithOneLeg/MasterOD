import { csrfFetch } from "./csrf"
import { flatten } from "./csrf"
const CREATE_RESOURCE_GROUP = 'resourceGroup/create'
const FETCH_RESOURCE_GROUP = 'resourceGroup/get/one'
const FETCH_ALL_RESOURCE_GROUPS = 'resourceGroup/get/all'
const UPDATE_RESOURCE_GROUP = 'resourceGroup/update'

const setNewResourceGroup = (newResourceGroup) => {
    return {
        type: CREATE_RESOURCE_GROUP,
        payload: newResourceGroup
    }
}

const setResourceGroup = (resourceGroup) => {
    return {
        type: FETCH_RESOURCE_GROUP,
        payload: resourceGroup
    }
}

const setAllResourceGroups = (resourceGroups) => {
    return {
        type: FETCH_ALL_RESOURCE_GROUPS,
        payload: resourceGroups
    }
}

const setUpdatedResourceGroup = (group) => {
    return {
        type: UPDATE_RESOURCE_GROUP,
        payload: group
    }
}

export const createResourceGroup = (newResourceGroup) => async (dispatch) => {
    console.log(newResourceGroup)
    const res = await csrfFetch('/api/resourcegroups/new', {
        method: "POST",
        body: JSON.stringify(newResourceGroup)
    })
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setNewResourceGroup(data))
    }
    return data
}

export const updateResources = async(id, resources, action) => {
    const res = await csrfFetch(`/api/resourcegroups/${id}/resources`, {
        method: "PATCH",
        body: JSON.stringify({resources, action})
    })
    const data = await res.json()

    // if (data && !data.errors) {
    //     const {resources} = data
    //     dispatch(setUpdatedResourceGroup({id, resources: flatten(resources)}))
    // }
    return data
}

export const updateGroup = (id, group) => async (dispatch) => {
    const res = await csrfFetch(`/api/resourcegroups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(group)
    })
    const data = await res.json()

    if (data && !data.errors) {
        const group = data
        dispatch(setUpdatedResourceGroup(group))
    }
    return data
}

export const fetchResourceGroup = (resourceGroupId, shareUrl) => async (dispatch) => {
    const body = resourceGroupId ? {resourceGroupId} : {shareUrl}
    const res = await csrfFetch(`/api/resourcegroups/single`, {
        method: "POST",
        body: JSON.stringify(body)
    })
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setResourceGroup({ ...data, resources: flatten(data.resources) }))
    }
    return data
}

export const fetchAllResourceGroups = (options) => async (dispatch) => {
    const res = await csrfFetch(`/api/resourcegroups/`, {
        method: "POST",
        body: JSON.stringify(options)
    })
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setAllResourceGroups(flatten(data)))
    }
    return data
}

const intitialState = { newResourceGroup: null, resourceGroup: null, all: null };

const resourceGroupReducer = (state = intitialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_RESOURCE_GROUP:
            newState = { ...state, newResourceGroup: action.payload }
            return newState
        case FETCH_RESOURCE_GROUP:
            newState = { ...state, resourceGroup: action.payload }
            return newState
        case FETCH_ALL_RESOURCE_GROUPS:
            newState = { ...state, all: action.payload }
            return newState
        case UPDATE_RESOURCE_GROUP:
            newState = { ...state}
            const resourceGroup = {...newState.resourceGroup}
            const newGroup = action.payload
            newState.resourceGroup = {...resourceGroup, group: {...newGroup}}
            return newState
        default:
            return state
    }
}

export default resourceGroupReducer
