import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-logo.png";
import * as sessionActions from '../../store/session'

const AccountSettings = () => {
    const [editMode, setEditMode] = useState(false);
    const [isOauthConnected, setIsOauthConnected] = useState()
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
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

                        }
                    }
                );
            }
        },
    });

    return (
        <div className="h-full w-full flex justify-center items-center">

            <div className={`h-full text-white p-8 ${isMobile ? "w-full" : "md:w-full lg:w-full xl:w-2/3 2xl:w-1/3"}`}>
                {/* Full-Width Header */}
                <div className="relative p-8 rounded-lg mb-8">
                    <div className="absolute right-8 top-8">
                        {/* <button
                className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 rounded"
                onClick={() => setEditMode(!editMode)}
            >
                {editMode ? "Cancel" : "Edit Profile"}
            </button> */}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold">{user.username}</h1>
                        <p className="text-zinc-400 mt-2">{user.email || ""}</p>
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="p-6 rounded-lg mb-8">
                    <h2 className="text-2xl mb-4 text-blue-600 border-b">Account Information</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-blue-400 mb-2 text-xl">Username</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    defaultValue={user.username}
                                    className="w-full p-2 rounded bg-zinc-900 text-white"
                                />
                            ) : (
                                <p>{user.username}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-blue-400 mb-2 text-xl">Email</label>
                            {editMode ? (
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full p-2 rounded bg-zinc-900 text-white"
                                />
                            ) : (
                                <p>{user.email}</p>
                            )}
                            <div className="flex flex-row items-center justify-center">
                                {user.isOauth ? <></>
                                    :
                                    (isOauthConnected ? <p>Connected!</p> : <div
                                        onClick={() => login()}
                                        className="w-full py-2 px-4 bg-zinc-600 text-white font-semibold rounded-md hover:bg-zinc-500 focus:outline-none focus:ring focus:ring-zinc-500 flex items-center justify-center cursor-pointer"
                                    >
                                        <img src={googleLogo} className="h-5 mr-2" alt="Google logo" />
                                        <p>Connect</p>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Section */}
                <div className="p-6 rounded-lg mb-8">
                    <h2 className="text-2xl mb-4 text-blue-600 border-b">Subscription</h2>
                    <p className="mb-2">Plan: Free</p>
                    <p>{user.billing || ""}</p>
                </div>

                {/* Logout Section */}
                {/* <div className="text-center mt-16">
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded">
            Logout
            </button>
        </div> */}
            </div>
        </div>
    );
};

export default AccountSettings;
