import { csrfFetch } from "./csrf";

const GET_RECENT_SAVED_RESULTS = 'results/recent'

const setRecentSavedResults = (recentSavedResults) => {
    return {
        type: GET_RECENT_SAVED_RESULTS,
        payload: recentSavedResults
    }
}

const getRecentSavedResults = () => async (dispatch) => {
    const res = await csrfFetch('/results')

    if (res.ok && res.status == 200) {
        const recentSavedResults = await res.json()
        dispatch(setRecentSavedResults(recentSavedResults))
    }
}

const initialState = {recentSavedResults: null}

const resultReducer = (state = initialState, action) => {
    let newState;
    switch (action) {
        case GET_RECENT_SAVED_RESULTS:
            newState = {...state, recentSavedResults: action.payload}
            return newState
        default:
            return state;
    }
}

export default resultReducer
