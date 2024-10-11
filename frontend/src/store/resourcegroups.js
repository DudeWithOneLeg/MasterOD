import { csrfFetch } from "./csrf"
const CREATE_RESOURCE_GROUP = 'resourcegrpup/create'

const setNewResourceGroup = (newResourceGroup) => {
    return {
        action: CREATE_RESOURCE_GROUP,
        payload: newResourceGroup
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

const intitialState = {newResourceGroup: null};

const resourceGroupReducer = (state = intitialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_RESOURCE_GROUP:
            newState = {...state, newResourceGroup: action.payload}
            return newState
        default:
            return state
    }
}

export default resourceGroupReducer
