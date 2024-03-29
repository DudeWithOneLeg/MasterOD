import { csrfFetch } from "./csrf";

const SET_SEARCH = "search/setSearch";
const SET_DATA = "search/setData";

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

export const search =
  ({ query, lat, lng }) =>
  async (dispatch) => {
    // const { credential, password } = user;
    const response = await csrfFetch("/api/dork", {
      method: "POST",
      body: JSON.stringify({
        query,
        lat,
        lng,
      }),
    });
    await response.json().then(async (data) => {
      // console.log(data)
      await dispatch(setSearch(data));
    });
    return response;
  };

  export const data =
  (url) =>
  async (dispatch) => {
    // const { credential, password } = user;
    const response = await csrfFetch(`/api/dork/iframe/`, {
      method: "POST",
      body: JSON.stringify({url})
    });
    await response.json().then(async (data) => {
      // console.log(data)
      await dispatch(setData(data));
      console.log(data)
    });
    return response;
  };

const initialState = { user: null };

const searchReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_SEARCH:
      newState = Object.assign({}, state);
      newState.results = { ...action.payload };
      return { ...newState };
    case SET_DATA:
      newState = Object.assign({}, state);
      newState.data = action.payload.data ;
      return newState
    default:
      return state;
  }
};

export default searchReducer;
