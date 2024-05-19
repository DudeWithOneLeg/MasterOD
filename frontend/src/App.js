import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Search from "./components/Search";
import SideBar from "./components/SideBar";
import QueryStats from "./components/QueryStats";
import ResultsPage from "./components/ResultsPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="h-screen w-screen flex">
        <div className="p-2 rounded h-full">
          <SideBar />
        </div>
        {isLoaded && user && (
          <Routes>
            {/* <> */}
            <Route path="/queries" element={<QueryStats />}/>
            <Route path="/results/:params" element={<ResultsPage />}/>
            <Route path="/" element={<Search />}/>
            {/* </> */}
          </Routes>
        )}

       
      </div>
    </>
  );
}

export default App;
