import { csrfFetch } from "./csrf";

const GET_SNAPSHOT = 'get/snapshots'

const setData = (data) => {
    return {
        type: GET_SNAPSHOT,
        payload: data
    }
}

export const getSnapshots = (params) => async dispatch => {
    const res = await csrfFetch('/api/archive/', {
        method: 'POST',
        body: JSON.stringify(params)
    })
    if (res.ok && res.status === 200) {
        const data = await res.json()
        dispatch(setData(data))
        return data
    }
}

const initialState = {}

const archiveReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SNAPSHOT:
            return {...state, snapshots: {...action.payload}}

        default:
            return state;
    }
}

export default archiveReducer
