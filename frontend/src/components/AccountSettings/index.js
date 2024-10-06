import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";

const AccountSettings = () => {
  const [editMode, setEditMode] = useState(false);
  const user = useSelector(state => state.session.user)

  // Example user data
//   const user = {
//     username: "John_Doe",
//     email: "johndoe@example.com",
//     subscription: "Premium",
//     billing: "Last payment: 09/20/2024",
//   };

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
