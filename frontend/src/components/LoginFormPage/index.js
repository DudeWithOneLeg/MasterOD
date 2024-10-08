import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useGoogleLogin } from "@react-oauth/google";
import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-logo.png";

function LoginFormPage() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const sessionUser = useSelector(state => state.session.user)
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionUser) {
            navigate('/search')
        }
    },[sessionUser, navigate])

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const hasAccess = hasGrantedAnyScopeGoogle(
                tokenResponse,
                "openid",
                "email",
                "profile"
            );
            if (hasAccess) {
                dispatch(sessionActions.login({ token: tokenResponse })).then(
                    async (data) => {
                        if (data && data.errors) {
                            setErrors(data.errors);
                        } else {
                            navigate("/search");
                        }
                    }
                );
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).then(
            async (data) => {
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    navigate("/search");
                }
            }
        ).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              setErrors(data.errors);
            }
            else navigate('/search')
          })
    };

    return (
        <div className={`h-full w-full flex items-center justify-center bg-zinc-900`}>
            <div className={`w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-lg shadow-lg`}>
                <h2 className="text-3xl text-center text-white">Log In</h2>
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="w-full">
                        <label htmlFor="credential" className="block text-sm font-medium text-zinc-300">Username or Email</label>
                        <input
                            id="credential"
                            name="credential"
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            placeholder="Username or Email"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.credential && (
                            <p className="mt-2 text-sm text-red-500">{errors.credential}</p>
                        )}
                    </div>
                    {credential.includes('@gmail.com') ? <></> : <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-zinc-500"
                            >
                                Log In
                            </button>
                        </div>
                    </>}
                </form>
                <div className="flex items-center justify-center">
                    <div
                        onClick={() => login()}
                        className="w-full py-2 px-4 bg-zinc-600 text-white font-semibold rounded-md hover:bg-zinc-500 focus:outline-none focus:ring focus:ring-zinc-500 flex items-center justify-center cursor-pointer"
                    >
                        <img src={googleLogo} className="h-5 mr-2" alt="Google logo" />
                        <p>Sign in with Google</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginFormPage;
