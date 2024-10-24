
  import { createStore, combineReducers, applyMiddleware, compose } from "redux";
  import thunk from "redux-thunk";
  import sessionReducer from "./session";
  import searchReducer from "./search";
  import resultReducer from "./result";
  import queryReducer from "./query";
  import archiveReducer from "./archive";
  import resourceGroupReducer from "./resourcegroups";

  const rootReducer = combineReducers({
    session: sessionReducer,
    search: searchReducer,
    results: resultReducer,
    queries: queryReducer,
    archive: archiveReducer,
    resourceGroups: resourceGroupReducer
  });

  let enhancer;

  if (process.env.NODE_ENV === "production") {
    enhancer = applyMiddleware(thunk);
  } else {
    const logger = require("redux-logger").default;
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }



  const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };

  export default configureStore;
