import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const GET_RECENT_SAVED_RESULTS = "results/recent";
const GET_RECENT_VISITED_RESULTS = "results/visited";
const SAVE_RESULT = "result/save";
const GET_ALL_RESULTS = 'results/all'
const DELETE_RESULT = 'result/delete'

const removeResult = (id) => {
  return {
    type: DELETE_RESULT,
    action: id
  }
}

const setAllResults = (results) => {
  return {
    type: GET_ALL_RESULTS,
    payload: results
  }
}

const setRecentVisitedResults = (recentVisitedResults) => {
  return {
    type: GET_RECENT_VISITED_RESULTS,
    payload: recentVisitedResults,
  };
};

const setRecentSavedResults = (recentSavedResults) => {
  return {
    type: GET_RECENT_SAVED_RESULTS,
    payload: recentSavedResults,
  };
};

const setSavedResults = (newResult) => {
  return {
    type: SAVE_RESULT,
    payload: newResult,
  };
};

export const deleteResult = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/results/${id}`, {
    method: "DELETE",
  });

  if (res.ok && res.status === 200) {
    dispatch(removeResult(id));
  }
};

export const postSavedResult = (newResult) => async (dispatch) => {
  const res = await csrfFetch("/api/results/save", {
    method: "POST",
    body: JSON.stringify(newResult),
  });

  if (res.ok && res.status === 200) {
    const savedResults = await res.json();
    dispatch(setSavedResults(savedResults));
  }
};

export const getRecentSavedResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results/saved");
  console.log('getRecentSavedR')
  if (res.ok && res.status === 200) {
    const recentSavedResults = await res.json();
    dispatch(setRecentSavedResults(recentSavedResults));
  }
};

export const getRecentVisitedResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results/history");
  console.log('getRecentVisitedR')
  if (res.ok && res.status === 200) {
    const recentVisitedResults = await res.json();
    dispatch(setRecentVisitedResults(recentVisitedResults));
  }
};

export const getallResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results");
  console.log('getallResults')
  if (res.ok && res.status === 200) {
    const results = await res.json();
    dispatch(setAllResults(results));
  }
};

const initialState = { recentSavedResults: null };

const resultReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case GET_RECENT_SAVED_RESULTS:
        newState = {
            ...state,
            recentSavedResults: { ...flatten(action.payload) },
        };
        return {...newState};

    case SAVE_RESULT:
      newState = {
        ...state,
        recentSavedResults: { ...flatten(action.payload) },
      };
      return {...newState};

    case GET_RECENT_VISITED_RESULTS:
      newState = {...state, recentVisited: {...flatten(action.payload)}}
      return newState;

    case GET_ALL_RESULTS:
      const data = action.payload
      newState = {...state, saved: {...flatten(data.results.filter(result => result.saved))}, visited: {...flatten(data.results)}}
      console.log(newState.visited)
      return newState;
    case DELETE_RESULT:
      const resultId = action.payload
      newState = {...state}
      const allResults = newState.allResults
      delete allResults[resultId]
      return newState
    default:
      return state;
  }
};

export default resultReducer;
