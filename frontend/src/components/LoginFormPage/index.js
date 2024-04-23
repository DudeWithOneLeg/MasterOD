
    import React, { useState } from "react";
    import * as sessionActions from "../../store/session";
    import { useDispatch, useSelector } from "react-redux";
    import { Redirect } from "react-router-dom";
    //import "./LoginForm.css";

    function LoginFormPage() {
      const dispatch = useDispatch();
      const sessionUser = useSelector((state) => state.session.user);
      const [credential, setCredential] = useState("");
      const [password, setPassword] = useState("");
      const [errors, setErrors] = useState({});

      if (sessionUser) return <Redirect to="/" />;

      const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).catch(
          async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          }
        );
      };

      return (
        <div className="w-fit flex flex-col items-center justify-content-center">
          {/* <h1>Log In</h1> */}
          <form onSubmit={handleSubmit} className="flex flex-col w-fit rounded border bg-slate-700 p-3">
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                placeholder='Username or Email'
                className="rounded my-1.5 p-1"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="rounded p-1"
              />
            {errors.credential && <p className="text-red-300 py-1.5">{errors.credential}</p>}
            <button type="submit" className="text-slate-200 border rounded hover:bg-slate-500 py-1 my-2">Log In</button>
          <button className="text-slate-200 border rounded hover:bg-slate-500 py-1">Sign up</button>
          </form>
        </div>
      );
    }

    export default LoginFormPage;
