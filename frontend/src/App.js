import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import * as sessionActions from "./store/session";
import Search from "./components/Search";
import SideBar from "./components/SideBar";
import QueryStats from "./components/QueryStats";
import ResultsPage from "./components/ResultsPage";
import WelcomePage from "./components/WelcomePage";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState(false);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    // dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    const path = window.location.pathname
    if (user && path == '/') {
      console.log(path)
      navigate('/search')

    }
  }, [user]);

  return (
    <>
      <div className="h-screen w-screen flex">
        <div className="p-2 rounded h-full">
          <SideBar setSearch={setSearch}/>
        </div>
        {isLoaded && user ? (
          <Routes>
            <Route path="/queries" element={<QueryStats />}/>
            <Route path="/results" element={<ResultsPage />}/>
            <Route path="/results/:view" element={<ResultsPage />}/>
            <Route path="/search" element={<Search setSearch={setSearch} search={search}/>}/>
            <Route path="/search/:view" element={<Search setSearch={setSearch} search={search}/>}/>
          </Routes>
        ) : (
          <div className="overflow-y-scroll">
            <Routes>
              <Route path="/search" element={<WelcomePage />}/>
            </Routes>

          </div>
        )}



      </div>
    </>
  );
}

export default App;
