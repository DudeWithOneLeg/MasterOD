import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { isMobile } from "react-device-detect";
//import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (username.length && username.length < 4) {
      setErrors({...errors, username: "Username must be 4 characters or more"})
    }
    if (!username.length || username.length && (username.length > 4 || username.length === 4) && errors.username) {
      const newErrors = {...errors}
      delete newErrors.username
      setErrors(newErrors)
    }
  },[username])

  useEffect(() => {
    if (password.length < 6) {
      setErrors({...errors, password: "Password must be 6 characters or more"})
    }
    if (!password.length || password.length && (password.length === 6 || password.length > 6) && errors.password) {
      const newErrors = {...errors}
      delete newErrors.password
      setErrors(newErrors)
    }
  },[password])

  useEffect(() => {
    if (password !== confirmPassword) {
      setErrors({...errors, confirmPassword: "Must match password"})
    }
    else {
      const newErrors = {...errors}
      delete newErrors.confirmPassword
      setErrors(newErrors)
    }
  },[confirmPassword])

  if (sessionUser) return redirect("/");

  const handleSubmit = (e) => {
    e.preventDefault()

    if (errors.username || errors.password || errors.confirmPassword) {
      return
    }

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          username,
          password,
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
    <div className={`w-${isMobile ? 'full': '1/2'} h-full flex flex-col items-center justify-content-center p-6 px-5`}>
      <form onSubmit={handleSubmit} className={`flex flex-col items-center w-${isMobile ? 'full' : '1/3'}`}>
        {/* <div className="py-2">
          <h1>Email</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="my-1 rounded"
          />
          {errors.email && <p>{errors.email}</p>}
        </div> */}
        <div className="py-2 flex flex-col items-center">
          <h1 className="align-self-start">Username</h1>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="my-1 p-1 rounded text-black w-full"
          />
        </div>
          {errors.username && <p className="text-red-300 text-wrap">{errors.username}</p>}

        {/* <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="my-1 rounded"
              />
            {errors.firstName && <p>{errors.firstName}</p>}

              <input
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
                className="my-1 rounded"
              />
            {errors.lastName && <p>{errors.lastName}</p>} */}
        <div className="py-2 flex flex-col items-center w-fit">
          <h1 className="align-self-start">Password</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="my-1 p-1 rounded text-black w-full"
          />
          {errors.password && <p className="text-red-300 py-1.5">{errors.password}</p>}
        </div>
        <div className="py-2 flex flex-col items-center w-fit">
          <label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="my-1 p-1 rounded text-black w-full"
            />
          </label>
          {errors.confirmPassword && <p className="text-red-300">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="my-1 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormPage;
