import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const GET_RECENT_SAVED_RESULTS = "results/recent";
const GET_RECENT_VISITED_RESULTS = "results/visited";
const SAVE_RESULT = "result/save";
const GET_ALL_RESULTS = "results/all";
const DELETE_RESULT = "result/delete";
const SET_SEARCH = "search/setSearch";

const setSearch = (results, status) => {
  return {
    type: SET_SEARCH,
    payload: { results, status },
  };
};

const removeResult = (results) => {
  return {
    type: DELETE_RESULT,
    payload: results,
  };
};

const setAllResults = (results) => {
  return {
    type: GET_ALL_RESULTS,
    payload: results,
  };
};

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

const setSavedResults = (newResults, id) => {
  return {
    type: SAVE_RESULT,
    payload: { newResults, id },
  };
};

export const search = (params, status = 'initial') => async (dispatch) => {

  const response = await csrfFetch("/api/dork", {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (response.ok && response.status === 200) {
    const data = await response.json()
    await dispatch(setSearch(data, status));
    return data;
  }
};

export const deleteResult = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/results/${id}`, {
    method: "DELETE",
  });

  if (res.ok && res.status === 200) {
    const results = await res.json();
    dispatch(removeResult(results));
  }
};

export const postSavedResult = (newResult, id) => async (dispatch) => {
  const res = await csrfFetch("/api/results/save", {
    method: "POST",
    body: JSON.stringify(newResult),
  });

  if (res.ok && res.status === 200) {
    const savedResults = await res.json();
    dispatch(setSavedResults(savedResults, id));
  }
};

export const getRecentSavedResults = () => async (dispatch) => {
  const res = await csrfFetch("/api/results/saved");
  console.log("getRecentSavedR");
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

export const getallResults = (options) => async (dispatch) => {
  const res = await csrfFetch("/api/results", {
    method: 'POST',
    body: JSON.stringify(options)
  });
  if (res.ok && res.status === 200) {
    const results = await res.json();
    dispatch(setAllResults(results));
  }
};

const initialState = { recentSavedResults: null };

const resultReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case SET_SEARCH:
      newState = { ...state };
      const status = action.payload.status;
      // console.log(action.payload);
      if (status === "initial") {
        newState.results = {};
      }
      // console.log(newState.results);
      if (status === 'next') {

        const results = newState.results;
        const newResults = action.payload.results.results;
        const resultKeys = Object.keys(results).slice(0, -1);
        // console.log(results, newResults, resultKeys)
        let lastIndex = Number(resultKeys.slice(-2, -1)[0]);
        // console.log(lastIndex)

        for (let key of resultKeys) {
          const newIndex = lastIndex + 1;
          const result = newResults[key];
          // console.log(result)
          if (result) {
            results[newIndex] = {...result, id: newIndex};
            // console.log(results, newIndex)
          }
          lastIndex = newIndex;
        }
        // results.info.currentPage = newResults.info.currentPage
        const currentPage = ((Object.keys(results).length - 1) / 100).toFixed()
        results.info.currentPage = currentPage + ''
        newState = {
          ...state,
          results: { ...results},
          recentQueries: { ...action.payload.results.recentQueries },
        };
        return { ...newState };
      } else {
        newState.results = { ...action.payload.results.results };
        return {
          ...newState,
          recentQueries: action.payload.results.recentQueries,
        };
      }

    case GET_RECENT_SAVED_RESULTS:
      newState = {
        ...state,
        recentSavedResults: { ...flatten(action.payload) },
      };
      return { ...newState };

    case SAVE_RESULT:
      newState = {
        ...state,
        recentSavedResults: { ...flatten(action.payload.newResults) },
      };
      return { ...newState };

    case GET_RECENT_VISITED_RESULTS:
      newState = { ...state, recentVisited: { ...flatten(action.payload) } };
      return newState;

    case GET_ALL_RESULTS:
      const data = action.payload;
      newState = {
        ...state,
        all: { ...flatten(data.results) },
      };
      return newState;
    case DELETE_RESULT:
      const recentSaved = flatten(action.payload.savedResults);
      const resultId = action.payload.id;
      newState = { ...state };
      newState.recentSavedResults = { ...recentSaved };
      const newSaved = newState.saved;
      const newVisited = newState.visited;
      if (newSaved && newSaved[resultId]) {
        delete newSaved[resultId];
      }
      if (newVisited && newVisited[resultId]) {
        const result = { ...newVisited[resultId] };
        result.saved = false;
        newVisited[resultId] = { ...result };
      }
      newState.saved = { ...newSaved };
      newState.visited = { ...newVisited };
      return newState;
    default:
      return state;
  }
};

export default resultReducer;
