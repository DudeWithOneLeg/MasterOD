import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const GET_RECENT_SAVED_RESULTS = "results/recent";
const GET_RECENT_VISITED_RESULTS = "results/visited";
const SAVE_RESULT = "result/save";
const GET_ALL_RESULTS = 'results/all'

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

  if (res.ok && res.status === 200) {
    const recentSavedResults = await res.json();
    dispatch(setRecentSavedResults(recentSavedResults));
  }
};

export const getRecentVisitedResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results/history");

  if (res.ok && res.status === 200) {
    const recentVisitedResults = await res.json();
    dispatch(setRecentVisitedResults(recentVisitedResults));
  }
};

export const getallResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results");

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
      newState = {...state, allResults: {...flatten(data.saved)}, visited: {...flatten(data.history)}}
      return newState;

    default:
      return state;
  }
};

export default resultReducer;
