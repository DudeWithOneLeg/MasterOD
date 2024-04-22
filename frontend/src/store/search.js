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
    console.log(data);
  });
  return response;
};

const initialState = { results: null, data: null };

console.log("this hit");

const searchReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_SEARCH:
      newState = { ...state };
      if (newState.results) {
        console.log(action.payload);
        const results = newState.results;
        const newResults = action.payload;
        const resultKeys = Object.keys(results).slice(0, -1);
        let lastIndex = Number(resultKeys.slice(-2, -1)[0]);
        console.log(lastIndex)

        console.log(typeof lastIndex);
        for (let key of resultKeys) {
          const newIndex = lastIndex + 1;
          const result = newResults[key];
          if (result) {
            results[newIndex] = result;

          }
          lastIndex = newIndex;
        }
        console.log(results);
        newState = { ...state, results:{...results} };
        return { ...newState };
      } else {
        newState.results = { ...action.payload };
        return { ...newState };
      }

    case SET_DATA:
      newState = Object.assign({}, state);
      newState.data = action.payload.data;
      return newState;
    default:
      return state;
  }
};

export default searchReducer;
