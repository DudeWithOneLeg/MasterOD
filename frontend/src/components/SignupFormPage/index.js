
    import React, { useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { redirect } from "react-router-dom";
    import * as sessionActions from "../../store/session";
    //import "./SignupForm.css";

    function SignupFormPage() {
      const dispatch = useDispatch();
      const sessionUser = useSelector((state) => state.session.user);
      const [email, setEmail] = useState("");
      const [username, setUsername] = useState("");
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [errors, setErrors] = useState({});

      if (sessionUser) return redirect("/");

      const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
          setErrors({});
          return dispatch(
            sessionActions.signup({
              email,
              username,
              firstName,
              lastName,
              password,
            })
          ).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              setErrors(data.errors);
            }
          });
        }
        return setErrors({
          confirmPassword: "Confirm Password field must be the same as the Password field"
        });
      };

      return (
        <div className="flex flex-col h-fit w-full items-center border-t-2 pt-2">

          <form onSubmit={handleSubmit} className="flex flex-col w-fit h-fit">
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
            <h1>Username</h1>
              <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
                className="my-1 rounded"
              />
            {errors.username && <p>{errors.username}</p>}

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
              <h1>Password</h1>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="my-1 rounded"
              />
            {errors.password && <p>{errors.password}</p>}
            <label>

              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="my-1 rounded"
              />
            </label>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            <button type="submit"className="my-1 rounded">Sign Up</button>
          </form>
        </div>
      );
    }

    export default SignupFormPage;
