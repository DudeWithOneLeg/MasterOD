import React, { useState } from "react";

const AccountSettings = () => {
  const [editMode, setEditMode] = useState(false);

  // Example user data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    subscription: "Premium",
    billing: "Last payment: 09/20/2024",
  };

  return (
    <div className="h-full w-full flex justify-center items-center">

        <div className="h-full text-white p-8 w-1/3">
        {/* Full-Width Header */}
        <div className="relative bg-slate-700 p-8 rounded-lg mb-8">
            <div className="absolute right-8 top-8">
            <button
                className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 rounded"
                onClick={() => setEditMode(!editMode)}
            >
                {editMode ? "Cancel" : "Edit Profile"}
            </button>
            </div>
            <div className="text-center">
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-zinc-400 mt-2">{user.email}</p>
            </div>
        </div>

        {/* Profile Information Section */}
        <div className="bg-slate-700 p-6 rounded-lg mb-8">
            <h2 className="text-2xl mb-4">Profile Information</h2>
            <div className="flex flex-col gap-4">
            <div>
                <label className="block text-zinc-400 mb-2">Name</label>
                {editMode ? (
                <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full p-2 rounded bg-zinc-900 text-white"
                />
                ) : (
                <p>{user.name}</p>
                )}
            </div>
            <div>
                <label className="block text-zinc-400 mb-2">Email</label>
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
        <div className="bg-slate-700 p-6 rounded-lg mb-8">
            <h2 className="text-2xl mb-4">Subscription</h2>
            <p className="mb-2">Plan: {user.subscription}</p>
            <p>{user.billing}</p>
        </div>

        {/* Logout Section */}
        <div className="text-center mt-16">
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded">
            Logout
            </button>
        </div>
        </div>
    </div>
  );
};

export default AccountSettings;
