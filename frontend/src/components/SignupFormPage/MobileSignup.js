import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { isMobile } from "react-device-detect";
import { useGoogleLogin } from "@react-oauth/google";
import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-logo.png";
//import "./SignupForm.css";

function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const hasAccess = hasGrantedAnyScopeGoogle(
                tokenResponse,
                "openid",
                "email",
                "profile"
            );
            if (hasAccess) {
                dispatch(sessionActions.signup({ token: tokenResponse })).catch(
                    async (res) => {
                        const data = await res.json();
                        if (data && data.success) {
                            redirect("/finish-signup");
                        }
                    }
                );
            }
        },
    });

    useEffect(() => {
        if (username.length && username.length < 6) {
            setErrors({
                ...errors,
                username: "Username must be 6 characters or more",
            });
        }
        if (
            !username.length ||
            (username.length &&
                (username.length > 6 || username.length === 6) &&
                errors.username)
        ) {
            const newErrors = { ...errors };
            delete newErrors.username;
            setErrors(newErrors);
        }
    }, [username]);

    useEffect(() => {
        if (password.length < 6) {
            setErrors({
                ...errors,
                password: "Password must be 6 characters or more",
            });
        }
        if (
            !password.length ||
            (password.length &&
                (password.length === 6 || password.length > 6) &&
                errors.password)
        ) {
            const newErrors = { ...errors };
            delete newErrors.password;
            setErrors(newErrors);
        }
    }, [password]);

    useEffect(() => {
        if (email.length && (!email.includes('@') || !email.includes('.') || !email.split('.')[1])) {
            setErrors({
                ...errors,
                email: "Must be a valid email",
            });
        } else {
            const newErrors = { ...errors };
            delete newErrors.email;
            setErrors(newErrors);
        }
    }, [email]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Must match password" });
        } else {
            const newErrors = { ...errors };
            delete newErrors.confirmPassword;
            setErrors(newErrors);
        }
    }, [confirmPassword]);

    if (sessionUser && !sessionUser.tempUser) return redirect("/");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (errors.username || errors.password || errors.confirmPassword) {
            return;
        }

        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    username,
                    password,
                    email
                })
            ).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        }
    };

    return (
        <div
            className={`w-${isMobile ? '2/3' : '1/3'} h-full flex flex-col items-center justify-content-center`}
        >
            <form
                onSubmit={handleSubmit}
                className={`flex flex-col items-center w-${isMobile ? 'full' : '1/2'}`}
            >
                <div className="py-2 flex flex-col items-center w-full">
                    <h1 className="align-self-start">Email</h1>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`my-1 p-1 rounded text-black w-full border-4 border-${errors.email ? 'red-200 bg-red-100' : ''} focus:outline-none`}
                    />
                    {errors.email ? <p className="text-red-300 h-5">{errors.email}</p> : <p className="h-6"></p>}
                </div>
                <div className="py-2 flex flex-col items-center w-full">
                    <h1 className="align-self-start">Username *</h1>
                    <input
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={`my-1 p-1 rounded text-black w-full border-4 border-${errors.username ? 'red-400 bg-red-100' : ''} focus:outline-none`}
                    />
                    {errors.username ?
                        <p className="text-red-300 text-wrap h-6">
                            {errors.username}
                        </p> : <p className="h-6"></p>
                    }
                </div>
                <div className="py-2 flex flex-col items-center w-full">
                    <h1 className="align-self-start">Password *</h1>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`my-1 p-1 rounded text-black w-full border-4 border-${errors.password ? 'red-400 bg-red-100' : ''} focus:outline-none`}
                    />
                    {errors.password ?
                        <p className="text-red-300 h-6">{errors.password}</p> : <p className="h-6"></p>
                    }
                </div>
                <div className="py-2 flex flex-col items-center w-full">
                    <h1 className="align-self-start">Confirm Password *</h1>
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`my-1 p-1 rounded text-black w-full border-4 border-${errors.confirmPassword ? 'red-400 bg-red-100' : ''} focus:outline-none`}
                    />
                    {errors.confirmPassword ?
                        <p className="text-red-300 h-6">{errors.confirmPassword}</p> : <p className="h-6"></p>
                    }
                </div>
                <div className={`flex flex-col items-center w-${isMobile ? '3/4' : '1/2'}`}>

                    <button type="submit" className="my-1 rounded-full border p-1 px-2 w-full hover:bg-slate-700">
                        Sign Up
                    </button>
                    <div
                        onClick={() => login()}
                        className="text-slate-200 w-full rounded hover:bg-slate-700 p-2 my-2 border flex flex-row items-center justify-center cursor-pointer"
                    >
                        <img src={googleLogo} className="h-5 px-1 " />
                        <p>Sign up with Google</p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignupFormPage;
