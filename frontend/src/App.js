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
  const [query, setQuery] = useState([]);
  const [string, setString] = useState("test")
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
          <SideBar setSearch={setSearch} setQuery={setQuery} setString={setString}/>
        </div>
        {isLoaded && user ? (
          <Routes>
            <Route path="/queries" element={<QueryStats setQuery={setQuery} setString={setString}/>}/>
            <Route path="/results" element={<ResultsPage />}/>
            <Route path="/results/:view" element={<ResultsPage />}/>
            <Route path="/search" element={<Search setSearch={setSearch} search={search} setQuery={setQuery} query={query} string={string} setString={setString}/>}/>
            <Route path="/search/:view" element={<Search setSearch={setSearch} search={search} setQuery={setQuery} query={query} string={string} setString={setString}/>}/>
          </Routes>
        ) : (
          <div className="">
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
