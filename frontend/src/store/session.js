import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password, token } = user;

  if (token) {
    const response = await csrfFetch("/api/session/google", {
      method: "POST",
      body: JSON.stringify({
        token
      }),
    });
    const data = await response.json()
    if (data && !data.errors) {

    }
    dispatch(setUser(data.user));
    console.log(data)
    return response;
  }
  else {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await response.json();
      dispatch(setUser(data.user));

    return response;

  }

};

export const sendFeedback = async (message) => {
  await csrfFetch('/api/users/feedback', {
    method: "POST",
    body: JSON.stringify(message)
  }).catch(err => console.log(err))
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  // console.log(data.user)
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, email, password, token, finishSignup } = user;

  if (token) {
    const response = await csrfFetch("/api/users/google", {
      method: "POST",
      body: JSON.stringify({
        token
      }),
    });
    const data = await response.json();

    if (data?.success) {
      dispatch(setUser({tempUser: true}));
    }
    else if (data?.user) {
      console.log()
      dispatch(setUser(data.user));
    }
    return response;
  }
  else if (finishSignup) {
    const response = await csrfFetch("/api/users/google", {
      method: "PATCH",
      body: JSON.stringify({
        username
      }),
    });
    const data = await response.json();
      dispatch(setUser(data.user));
    return response;
  }
  else {

    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data && !data.errors) {

      dispatch(setUser(data.user));
    }
    return data;
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
