import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
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
import stars from './assets/images/stars.jpg'
import WelcomePage from "./components/WelcomePage";
import AccountSettings from "./components/AccountSettings/index.js";
import TermsOfServicePage from "./components/TermsOfServicePage";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector((state) => state.session.user);
    const path = window.location.pathname;
    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    useEffect(() => {
        if (user && path === '/') navigate('/search')
    },[isLoaded])

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
            <div className={`h-full w-full poppins-regular flex flex-${isMobile ? "col" : "col"} bg-zinc-900`}>
                {!isMobile ? <Navigation /> : <></>}
                {isMobile ? (
                    <div className="h-[5%]">
                        <SideBar />
                    </div>
                ) : (
                    <div className="h-[5%]"></div>
                )}
                <div className={`h-[95%] w-full flex flex-${isMobile ? "col" : "row"}`}>
                    {user && !user.tempUser && !isMobile ? <SideBar /> : <></>}
                    {isLoaded ? (
                        <Routes>
                            <Route path="/guide" element={<GuidePage />} />
                            <Route path="/tos" element={<TermsOfServicePage />} />

                            {/* Public routes */}
                            <Route path="/login" element={<LoginFormPage />} />
                            <Route path="/signup" element={<SignupFormPage />} />
                            <Route path="/" element={<WelcomePage />} />

                            {/* Protected routes */}
                            <Route element={<ProtectedRoute user={user} />}>
                                <Route path="/finish-signup" element={<FinishSignup />} />
                                <Route path="/results" element={<ResultsPage />} />
                                <Route path="/results/:view" element={<ResultsPage />} />
                                <Route path="/results/:view/:group" element={<ResultsPage />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/search/current" element={<Search />} />
                                <Route path="/search/:view" element={<Search />} />
                                <Route path="/user/settings" element={<AccountSettings />} />
                            </Route>

                            {/* Catch-all route */}
                            <Route path="*" element={<Navigate to={user && !user.tempUser ? "/search" : "/"} />} />
                        </Routes>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

const ProtectedRoute = ({ user }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    else if (user.tempUser) {
        return <Navigate to="/finish-signup" replace />;
    }
    return <Outlet />;
};

export default App;
