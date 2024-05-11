import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Search from "./components/Search";
import Results from "./components/Results";
import SideBar from "./components/SideBar";
import QueryStats from "./components/QueryStats";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="h-screen w-screen flex ">
      <div className="p-2 rounded">
        <SideBar/>

      </div>
      {
        isLoaded && user && <Switch>
          <Route path='/'>
            <Search />

          </Route>
          <Route path='/queries'>
            <QueryStats />

          </Route>
        </Switch>
      }

      {isLoaded && !user && (
        <Switch className="flex flex-col jusify-content-around items-center h-fit w-fit">
          <Route path='/login'>
          <LoginFormPage />

          </Route>
          <Route path='/signup'>

            <SignupFormPage />
          </Route>
        </Switch>
      )}
      </div>
    </>
  );
}

export default App;
