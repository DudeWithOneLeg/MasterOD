import { csrfFetch } from "./csrf";
import { flatten } from "./csrf";

const SET_SEARCH = "search/setSearch";
const SET_DATA = "search/setData";
const SET_RECENT_QUERIES = "queries/recent";
const SET_SAVED_QUERY = 'query/save'

const setSavedQuery = (query) => {
  return {
    type: SET_SAVED_QUERY,
    payload: query
  }
}

const setRecentQueries = (queries) => {
  return {
    type: SET_RECENT_QUERIES,
    payload: queries
  }
}

const setSearch = (results) => {
  return {
    type: SET_SEARCH,
    payload: results,
  };
};

const setData = (data) => {
  return {
    type: SET_DATA,
    payload: data,
  };
};

export const saveQuery = (query) => async (dispatch) => {
  console.log(query)
  const res = await csrfFetch('/api/dork/save', {
    method: 'post',
    body: JSON.stringify(query)
  })

  if (res.status === 200) {
    const data = await res.json()
    dispatch(setSavedQuery(data))
  }
}

export const getRecentQueries = () => async (dispatch) => {
  const res = await csrfFetch('/api/dork/queries/recent')

  if (res.status === 200) {
    const recentQueries = await res.json()
    dispatch(setRecentQueries(recentQueries))
  }
}

export const search = (params) => async (dispatch) => {
  // const { credential, password } = user;
  const response = await csrfFetch("/api/dork", {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (response.ok && response.status === 200) {

    await response.json().then(async (data) => {
      // console.log(data)
      if (!data.message) {
        await dispatch(setSearch(data))

      }
      return data;
    });
  }
};

export const data = (url) => async (dispatch) => {
  // const { credential, password } = user;
  const response = await csrfFetch(`/api/dork/iframe/`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  await response.json().then(async (data) => {
    // console.log(data)
    await dispatch(setData(data));
    // console.log(data);
  });
  return response;
};

const initialState = { results: null, data: null, recentQueries: null, recentSavedQueries: null };

const searchReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_SEARCH:

      newState = { ...state };

      // console.log(newState.results);
      if (newState.results) {

        const results = newState.results;
        const newResults = action.payload.results;
        const resultKeys = Object.keys(results).slice(0, -1);
        let lastIndex = Number(resultKeys.slice(-2, -1)[0]);

        for (let key of resultKeys) {
          const newIndex = lastIndex + 1;
          const result = newResults[key];
          if (result) {
            results[newIndex] = result;

          }
          lastIndex = newIndex;
        }
        // console.log(results);
        newState = { ...state, results:{...results}, recentQueries: action.payload.recentQueries};
        return { ...newState };
      } else {
        newState.results = { ...action.payload.results };
        return { ...newState, recentQueries: action.payload.recentQueries };
      }

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
      console.log(action.payload)
      newState.recentSavedQueries = flatten(action.payload)
      return newState
    default:
      return state;
  }
};

export default searchReducer;
