import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const GET_QUERIES = 'queries/all'
const UPDATE_QUERY = 'query/update'

const setQueries = (queries) => {
    return {
        type: GET_QUERIES,
        payload: queries
    }
}

const setNewQuery = (query) => {
    return {
        type: UPDATE_QUERY,
        payload: query
    }
}

export const getQueries = (options) => async (dispatch) => {
    const res = await csrfFetch('/api/queries', {
        method: 'POST',
        body: JSON.stringify(options)
    })
    if (res.ok && res.status === 200) {
        const data = await res.json()
        const queries = data.length ? flatten(data) : {message: "No results found"}
        dispatch(setQueries(queries))
        return queries
    }
}

export const updateQuery = (queryId) => async (dispatch) => {
    const res = await csrfFetch(`/api/queries/${queryId}`, {
        method: 'POST'
    })
    if (res.ok && res.status === 200) {
        const query = await res.json()
        dispatch(setNewQuery(query))
    }
}

const intitialState = {all: null};

const queryReducer = (state = intitialState, action) => {
    let newState;
    switch (action.type) {
        case GET_QUERIES:
            newState = {...state, all: action.payload}
            return newState;

        case UPDATE_QUERY:
            const queries = {...state.all}
            const newQuery = action.payload
            queries[newQuery.id] = {...action.payload}
             newState = {...state, all: {...queries}}

            return newState
        default:
            return state
    }
}

export default queryReducer
