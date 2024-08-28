import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import {isMobile} from 'react-device-detect'
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
  const [string, setString] = useState("")
  const user = useSelector((state) => state.session.user);
  const [visitedResults, setVisitedResults] = useState([])
  const [currentSelected, setCurrentSelected] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [isIndex, setIsIndex] = useState(false);
  const [isRedditShared, setIsRedditShared] = useState(false);
  const [isOnReddit, setIsOnReddit] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <div className={`h-screen w-screen flex flex-${isMobile ? 'col' : 'row'}`}>
        <div className={`rounded z-30`}>
          <SideBar setSearch={setSearch} setQuery={setQuery} setString={setString}/>
        </div>
        {isLoaded && user ? (
          <Routes>

            <Route path="/queries" element={<QueryStats setQuery={setQuery} setString={setString}/>}/>
            <Route path="/results" element={<ResultsPage currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} visitedResults={visitedResults} setVisitedResults={setVisitedResults} loadingResults={loadingResults} isIndex={isIndex} setIsIndex={setIsIndex} isRedditShared={isRedditShared} setIsRedditShared={setIsRedditShared} isOnReddit={isOnReddit} setIsOnReddit={setIsOnReddit} loading={loading} setLoading={setLoading}/>}/>
            <Route path="/results/:view" element={<ResultsPage currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} visitedResults={visitedResults} setVisitedResults={setVisitedResults} loadingResults={loadingResults} isIndex={isIndex} setIsIndex={setIsIndex} isRedditShared={isRedditShared} setIsRedditShared={setIsRedditShared} isOnReddit={isOnReddit} setIsOnReddit={setIsOnReddit} loading={loading} setLoading={setLoading}/>}/>
            <Route path="/search" element={<Search setSearch={setSearch} search={search} setQuery={setQuery} query={query} string={string} setString={setString} currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} visitedResults={visitedResults} setVisitedResults={setVisitedResults} loadingResults={loadingResults} setLoadingResults={setLoadingResults} isIndex={isIndex} setIsIndex={setIsIndex} isRedditShared={isRedditShared} setIsRedditShared={setIsRedditShared} isOnReddit={isOnReddit} setIsOnReddit={setIsOnReddit} loading={loading} setLoading={setLoading}/>}/>
            <Route path="/search/:view" element={<Search setSearch={setSearch} search={search} setQuery={setQuery} query={query} string={string} setString={setString} currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} visitedResults={visitedResults} setVisitedResults={setVisitedResults} loadingResults={loadingResults} setLoadingResults={setLoadingResults} isIndex={isIndex} setIsIndex={setIsIndex} isRedditShared={isRedditShared} setIsRedditShared={setIsRedditShared} isOnReddit={isOnReddit} setIsOnReddit={setIsOnReddit} loading={loading} setLoading={setLoading}/>}/>
          </Routes>
        ) : (
          <div className="overflow-y-scroll">
            <Routes>
              <Route path="/" element={<WelcomePage />}/>
            </Routes>

          </div>
        )}


        {isMobile ? <div className="h-16"></div>:<></>}
      </div>
    </>
  );
}

export default App;
