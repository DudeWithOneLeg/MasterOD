import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import * as sessionActions from "./store/session";
import Search from "./components/Search";
import SideBar from "./components/SideBar";
import QueryStats from "./components/QueryStats";
import ResultsPage from "./components/ResultsPage";
import WelcomePage from "./components/WelcomePage";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ThreeDScene from "./components/3Dscene";
import FinishSignup from "./components/FinishSignup";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState(false);
    const [query, setQuery] = useState([]);
    const [string, setString] = useState("");
    const user = useSelector((state) => state.session.user);
    const [visitedResults, setVisitedResults] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [loadingResults, setLoadingResults] = useState(false);
    const [isIndex, setIsIndex] = useState(false);
    const [isRedditShared, setIsRedditShared] = useState(false);
    const [isOnReddit, setIsOnReddit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hide, setHide] = useState(true);
    const path = window.location.pathname;

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);
    useEffect(() => {
        console.log("Query updated:", query);
    }, [query]);

    useEffect(() => {
        if (user) navigate('/search')
    },[])

    useEffect(() => {
        // dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
        if (isLoaded &&
            user &&
            !user.tempUser && (path === '/' || path === '/login' || path === '/signup')
        ) {
            navigate("/search");
        } else if (isLoaded && user && user.tempUser) {
            navigate("/finish-signup");
        } else if (isLoaded && !user && path !== '/login' && path !== '/signup') {
            navigate("/");
        }
    }, [user]);

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div
                className={`h-full w-full flex flex-${
                    isMobile ? "col" : "col"
                } bg-zinc-900`}
            >
                {(isMobile && !user) || !isMobile ? (
                    <Navigation setHide={setHide} />
                ) : (
                    <></>
                )}
                {isMobile ? (
                    <div className="h-[5%]">
                        <SideBar
                            setSearch={setSearch}
                            setQuery={setQuery}
                            setString={setString}
                            hide={hide}
                            setHide={setHide}
                        />
                    </div>
                ) : (
                    <div className="h-[5%]"></div>
                )}
                <div
                    className={`h-[95%] w-full flex flex-${
                        isMobile ? "col" : "row"
                    } bg-black`}
                >
                    {user && !user.tempUser && !isMobile ? (
                        <SideBar
                            setSearch={setSearch}
                            setQuery={setQuery}
                            setString={setString}
                            hide={hide}
                            setHide={setHide}
                        />
                    ) : (
                        <></>
                    )}

                    {isLoaded && user ? (
                        <Routes>
                            {!user.tempUser ? (
                                <>
                                    <Route
                                        path="/queries"
                                        element={
                                            <QueryStats
                                                setQuery={setQuery}
                                                setString={setString}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/results"
                                        element={
                                            <ResultsPage
                                                currentSelected={
                                                    currentSelected
                                                }
                                                setCurrentSelected={
                                                    setCurrentSelected
                                                }
                                                visitedResults={visitedResults}
                                                setVisitedResults={
                                                    setVisitedResults
                                                }
                                                loadingResults={loadingResults}
                                                isIndex={isIndex}
                                                setIsIndex={setIsIndex}
                                                isRedditShared={isRedditShared}
                                                setIsRedditShared={
                                                    setIsRedditShared
                                                }
                                                isOnReddit={isOnReddit}
                                                setIsOnReddit={setIsOnReddit}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/results/:view"
                                        element={
                                            <ResultsPage
                                                currentSelected={
                                                    currentSelected
                                                }
                                                setCurrentSelected={
                                                    setCurrentSelected
                                                }
                                                visitedResults={visitedResults}
                                                setVisitedResults={
                                                    setVisitedResults
                                                }
                                                loadingResults={loadingResults}
                                                isIndex={isIndex}
                                                setIsIndex={setIsIndex}
                                                isRedditShared={isRedditShared}
                                                setIsRedditShared={
                                                    setIsRedditShared
                                                }
                                                isOnReddit={isOnReddit}
                                                setIsOnReddit={setIsOnReddit}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/search"
                                        element={
                                            <Search
                                                setSearch={setSearch}
                                                search={search}
                                                setQuery={setQuery}
                                                query={query}
                                                string={string}
                                                setString={setString}
                                                currentSelected={
                                                    currentSelected
                                                }
                                                setCurrentSelected={
                                                    setCurrentSelected
                                                }
                                                visitedResults={visitedResults}
                                                setVisitedResults={
                                                    setVisitedResults
                                                }
                                                loadingResults={loadingResults}
                                                setLoadingResults={
                                                    setLoadingResults
                                                }
                                                isIndex={isIndex}
                                                setIsIndex={setIsIndex}
                                                isRedditShared={isRedditShared}
                                                setIsRedditShared={
                                                    setIsRedditShared
                                                }
                                                isOnReddit={isOnReddit}
                                                setIsOnReddit={setIsOnReddit}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/search/:view"
                                        element={
                                            <Search
                                                setSearch={setSearch}
                                                search={search}
                                                setQuery={setQuery}
                                                query={query}
                                                string={string}
                                                setString={setString}
                                                currentSelected={
                                                    currentSelected
                                                }
                                                setCurrentSelected={
                                                    setCurrentSelected
                                                }
                                                visitedResults={visitedResults}
                                                setVisitedResults={
                                                    setVisitedResults
                                                }
                                                loadingResults={loadingResults}
                                                setLoadingResults={
                                                    setLoadingResults
                                                }
                                                isIndex={isIndex}
                                                setIsIndex={setIsIndex}
                                                isRedditShared={isRedditShared}
                                                setIsRedditShared={
                                                    setIsRedditShared
                                                }
                                                isOnReddit={isOnReddit}
                                                setIsOnReddit={setIsOnReddit}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        }
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {user.tempUser ? (
                                <Route
                                    path="/finish-signup"
                                    element={
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FinishSignup />
                                        </div>
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </Routes>
                    ) : (
                        <Routes>
                            <Route path="/" element={<ThreeDScene />} />
                            <Route
                                path="/login"
                                element={
                                    <div className="w-full h-full flex items-center justify-center">
                                        <LoginFormPage />
                                    </div>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <SignupFormPage />
                                    </div>
                                }
                            />
                        </Routes>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
