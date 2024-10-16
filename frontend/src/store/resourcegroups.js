import { csrfFetch } from "./csrf"
import { flatten } from "./csrf"
const CREATE_RESOURCE_GROUP = 'resourceGroup/create'
const FETCH_RESOURCE_GROUP = 'resourceGroup/get'
const FETCH_ALL_RESOURCE_GROUPS = 'resourceGroup/get/all'

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

export const createResourceGroup = (newResourceGroup) => async (dispatch) => {
    const res = await csrfFetch('/api/resourcegroups', {
        method: "POST",
        body: JSON.stringify(newResourceGroup)
    })
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setNewResourceGroup(data))
    }
    return data
}

export const fetchResourceGroup = (resourceGroupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/resourcegroups/${resourceGroupId}`)
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setResourceGroup({ ...data, resources: flatten(data.resources) }))
    }
    return data
}

export const fetchAllResourceGroups = () => async (dispatch) => {
    const res = await csrfFetch(`/api/resourcegroups/`)
    const data = await res.json()

    if (data && !data.errors) {
        dispatch(setAllResourceGroups(flatten(data)))
    }
    return data
}

const intitialState = { newResourceGroup: null };

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
        default:
            return state
    }
}

export default resourceGroupReducer
