import { csrfFetch } from "./csrf";

const GET_RECENT_SAVED_RESULTS = "results/recent";
const SAVE_RESULT = "result/save";

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
  const res = await csrfFetch("/api/results", {
    method: "POST",
    body: JSON.stringify({newResult}),
  });

  if (res.ok && res.status == 200) {
    const savedResults = await res.json();
    dispatch(setSavedResults(savedResults));
  }
};

export const getRecentSavedResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results");

  if (res.ok && res.status == 200) {
    const recentSavedResults = await res.json();
    dispatch(setRecentSavedResults(recentSavedResults));
  }
};

const initialState = { recentSavedResults: null };

const resultReducer = (state = initialState, action) => {
  let newState;
  switch (action) {
    case GET_RECENT_SAVED_RESULTS:
      newState = { ...state, recentSavedResults: action.payload };
      return newState;
    case SAVE_RESULT:
      newState = { ...state, recentSavedResults: action.payload };
      return newState;
    default:
      return state;
  }
};

export default resultReducer;
