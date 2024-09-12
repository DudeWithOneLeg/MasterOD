import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useGoogleLogin } from "@react-oauth/google";
import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-logo.png";

function LoginFormPage() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
                console.log(data)
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
        <div
            className={`w-${
                isMobile ? "2/3" : "1/2"
            } h-full flex flex-col items-center justify-content-center`}
        >
            <form
                onSubmit={handleSubmit}
                className={`flex flex-col w-${isMobile ? "full" : "1/3"}`}
            >
                <h1 className="align-self-start text-white">
                    Username or Email
                </h1>
                <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                    placeholder="Username or Email"
                    className="rounded my-2 p-1 text-black focus:outline-none"
                />
                <h1 className="align-self-start text-white mt-2">Password</h1>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="rounded p-1 text-black mt-2 focus:outline-none"
                />
                {errors.credential ? (
                    <p className="text-red-300 h-8">{errors.credential}</p>
                ) : (
                    <p className="h-8"></p>
                )}
                <button
                    type="submit"
                    className="text-slate-200 rounded hover:bg-slate-700 py-1 my-2 border h-10"
                >
                    Log In
                </button>
                {/* <div
                    onClick={() => login()}
                    className="text-slate-200 rounded hover:bg-slate-700 py-1 my-2 border flex flex-row items-center justify-center cursor-pointer h-10"
                >
                    <img src={googleLogo} className="h-5 px-1" />
                    <p>Sign in with Google</p>
                </div> */}
            </form>
        </div>
    );
}

export default LoginFormPage;
