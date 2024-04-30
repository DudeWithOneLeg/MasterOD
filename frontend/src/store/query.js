import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const GET_QUERIES = 'queries/all'

const setQueries = (queries) => {
    return {
        type: GET_QUERIES,
        payload: queries
    }
}

export const getQueries = () => async (dispatch) => {
    const res = await csrfFetch('/api/queries')
    if (res.ok && res.status == 200) {
        const queries = await res.json()
        dispatch(setQueries(queries))
    }
}

const intitialState = {all: null};

const queryReducer = (state = intitialState, action) => {
    let newState;
    switch (action.type) {
        case GET_QUERIES:
            newState = {...state, all: flatten(action.payload)}
            return newState;
        default:
            return state
    }
}

export default queryReducer
