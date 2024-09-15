import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import * as sessionActions from "./store/session";
import Search from "./components/Search";
import SideBar from "./components/SideBar";
import ResultsPage from "./components/ResultsPage";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ThreeDScene from "./components/3Dscene";
import FinishSignup from "./components/FinishSignup";
import GuidePage from "./components/GuidePage";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector((state) => state.session.user);
    const path = window.location.pathname;
    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    // useEffect(() => {
    //     if (user) navigate('/search')
    // },[isLoaded])

    // useEffect(() => {
    //     if (isLoaded &&
    //         user &&
    //         !user.tempUser && (path === '/' || path === '/login' || path === '/signup')
    //     ) {
    //         navigate("/search");
    //     } else if (isLoaded && user && user.tempUser) {
    //         navigate("/finish-signup");
    //     } else if (isLoaded && !user && path !== '/login' && path !== '/signup') {
    //         navigate("/");
    //     }
    // }, [user, isLoaded]);

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div
                className={`h-full w-full flex flex-${
                    isMobile ? "col" : "col"
                } bg-zinc-900`}
            >
                {(isMobile && !user) || !isMobile ? (
                    <Navigation />
                ) : (
                    <></>
                )}
                {isMobile ? (
                    <div className="h-[5%]">
                        <SideBar />
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
                        <SideBar />
                    ) : (
                        <></>
                    )}
                    <Routes>
                        <Route path='/guide' element={<GuidePage/>}/>
                    {isLoaded && user ? (
                                <>
                                    <Route
                                        path="/results"
                                        element={
                                            <ResultsPage/>
                                        }
                                    />
                                    <Route
                                        path="/results/:view"
                                        element={
                                            <ResultsPage />
                                        }
                                    />
                                    <Route
                                        path="/search"
                                        element={
                                            <Search />
                                        }
                                    />
                                    <Route
                                        path="/search/:view"
                                        element={
                                            <Search />
                                        }
                                    />

                                <Route
                                    path="/finish-signup"
                                    element={
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FinishSignup />
                                        </div>
                                    }
                                    />
                                    </>

                    ) : (
                        <>
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
                        </>
                    )}
                        <Route path='*' element={<Navigate to={user ? '/search':'/'}/>}/>
                    </Routes>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
