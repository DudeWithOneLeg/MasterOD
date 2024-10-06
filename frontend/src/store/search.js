import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const SET_DATA = "search/setData";
const SET_RECENT_QUERIES = "queries/recent";
const SET_SAVED_QUERY = "query/save";

const setRecentSavedQueries = (queries) => {
  return {
    type: SET_SAVED_QUERY,
    payload: queries,
  };
};

const setRecentQueries = (queries) => {
  return {
    type: SET_RECENT_QUERIES,
    payload: queries,
  };
};


const setData = (data) => {
  return {
    type: SET_DATA,
    payload: data,
  };
};

export const saveQuery = (query) => async (dispatch) => {
  const res = await csrfFetch("/api/queries/save", {
    method: "POST",
    body: JSON.stringify(query),
  });

  if (res.status === 200) {
    const data = await res.json();
    dispatch(setRecentSavedQueries(data));
  }
};

export const getRecentSavedQueries = () => async (dispatch) => {
  const res = await csrfFetch("/api/queries/save");
  if (res.status === 200) {
    const recentQueries = await res.json();
    dispatch(setRecentSavedQueries(recentQueries));
  }
};

export const getRecentQueries = () => async (dispatch) => {
  const res = await csrfFetch("/api/dork/queries/recent");

  if (res.status === 200) {
    const recentQueries = await res.json();
    dispatch(setRecentQueries(recentQueries));
  }
};

export const fetchResult = (result) => async (dispatch) => {
  // const { credential, password } = user;
  const response = await csrfFetch(`/api/dork/iframe/`, {
    method: "POST",
    body: JSON.stringify(result),
  });
  await response.json().then(async (data) => {
    // console.log(data)
    await dispatch(setData(data));
  });
  return response;
};

const initialState = {
  results: null,
  data: null,
  recentQueries: null,
  recentSavedQueries: null,
};

const searchReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {

    case SET_DATA:
      newState = Object.assign({}, state);
      newState.data = action.payload.data;
      return newState;
    case SET_RECENT_QUERIES:
      newState = Object.assign({}, state);
      // console.log(action.payload)
      newState.recentQueries = action.payload;
      return newState;
    case SET_SAVED_QUERY:
      newState = Object.assign({}, state);
      console.log(action.payload);
      newState.recentSavedQueries = flatten(action.payload);
      return newState;
    default:
      return state;
  }
};

export default searchReducer;
