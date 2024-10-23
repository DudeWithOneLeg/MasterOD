import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { isMobile } from "react-device-detect";
import { useGoogleLogin } from "@react-oauth/google";
import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-logo.png";
import ToS from "./ToS";

function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [acceptedTOS, setAcceptedTOS] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionUser) navigate('/search');
    }, []);

    useEffect(() => {
        if (sessionUser) navigate('/search');
    }, [sessionUser]);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const hasAccess = hasGrantedAnyScopeGoogle(
                tokenResponse,
                "openid",
                "email",
                "profile"
            );
            if (hasAccess) {
                dispatch(sessionActions.signup({ token: tokenResponse }))
                    .then(async (data) => {
                        if (data && data.success) {
                            navigate("/finish-signup",{ replace: true });
                        } else {
                            console.log('Redirection condition not met');
                        }
                    })
                    .catch(async (res) => {
                        try {
                            const data = await res.json();
                            if (data && data.errors) {
                                setErrors(data.errors);
                            }
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    });
            }
        }
    });

    useEffect(() => {
        if (username.length && username.length < 6) {
            setErrors({
                ...errors,
                username: "Username must be 6 characters or more",
            });
        } else if (username.length >= 6 && errors.username) {
            const newErrors = { ...errors };
            delete newErrors.username;
            setErrors(newErrors);
        }
    }, [username]);

    useEffect(() => {
        if (password.length && password.length < 6) {
            setErrors({
                ...errors,
                password: "Password must be 6 characters or more",
            });
        } else if (password.length && password.length >= 6 && errors.password) {
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
        } else if (email.includes('@') && email.includes('.') && email.split('.')[1] && errors.email) {
            const newErrors = { ...errors };
            delete newErrors.email;
            setErrors(newErrors);
        }
        if (!email) {
            const newErrors = { ...errors };
            delete newErrors.email;
            setErrors(newErrors);
        }
    }, [email]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Must match password" });
        } else if (password === confirmPassword && errors.confirmPassword) {
            const newErrors = { ...errors };
            delete newErrors.confirmPassword;
            setErrors(newErrors);
        }
    }, [confirmPassword]);

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
            ).then(async (data) => {
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            }).catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        }
    };
    const isValidForm = () => !Object.values(errors).length && acceptedTOS && username.length && password.length && confirmPassword.length;

    return (
        <div className={`h-full w-full flex items-center justify-center bg-zinc-900 text-white`}>
            <div className={`w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-lg shadow-lg`}>
                <h2 className="text-3xl text-center text-white">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.username && (
                            <p className="mt-2 text-sm text-red-500">{errors.username}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
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
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm Password"
                            className="mt-1 block w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <ToS acceptedTOS={acceptedTOS} setAcceptedTOS={setAcceptedTOS}/>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-zinc-500 ${isValidForm() ? 'bg-blue-500 hover:bg-blue-400' : 'bg-zinc-600'}`}
                            disabled={!isValidForm()}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-center">
                    <div
                        onClick={() => login()}
                        className="w-full py-2 px-4 bg-zinc-600 text-white font-semibold rounded-md hover:bg-zinc-500 focus:outline-none focus:ring focus:ring-zinc-500 flex items-center justify-center cursor-pointer"
                    >
                        <img src={googleLogo} className="h-5 mr-2" alt="Google logo" />
                        <p>Sign up with Google</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupFormPage;
