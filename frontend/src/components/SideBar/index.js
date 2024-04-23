import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import SignupFormPage from "../SignupFormPage";
import LoginFormPage from "../LoginFormPage";

export default function SideBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [moveRight, setMoveRight] = useState(false);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  return (
    <div className="h-full w-[300px] bg-slate-500 overflow-hidden flex flex-row text-slate-200">

      <div className={`flex flex-row transition-all duration-700 ease-in-out ${moveRight ? 'ml-[-600px]' : 'ml-[-300px]'}`}>

      <div
        className={`p-4 w-[300px]`}
      >
        <div className="flex flex-row items-center">
          <img src="icons/profile.jpg" className="rounded-full h-14"></img>
          <p className="pl-4">{user ? user.username : ""}</p>
        </div>
        <div className={`p-4 text-lg`}>
          <h1 className="p-2 text-black">Saved Queries</h1>
          <h1 className="p-2">Recent Queries</h1>
          <div>
            {user && user.recentQueries && user.recentQueries.slice(0, 5).map((query) => {
              return (
                <p className="truncate text-sm p-1 pl-4">
                  {query.query.split(";").join(" ")}
                </p>
              );
            })}
          </div>
          <p className={`p-2 transition-all duration-700 ease-in-out ${
          user ? "ml-0" : "-ml-96"
        }`}>Visited</p>
          <p className={`p-2 transition-all duration-700 ease-in-out ${
          user ? "ml-0" : "-ml-96"
        }`}>Saved Sites</p>
          <p className={`p-2 transition-all duration-700 ease-in-out ${
          user ? "ml-0" : "-ml-96"
        }`}>Site History</p>
        </div>
      <p onClick={(e) => handleLogOut(e)}>Sign out</p>
      </div>


      <div
        className={`flex flex-col w-[300px]`}
      >

        <p
          onClick={() => {
            setMoveRight(true);
            setLogin(true);
          }}
          className="w-[300px]"
        >
          Log in
        </p>
        <p
          onClick={() => {
            setMoveRight(true);
            setSignup(true);
          }}
          className="w-[300px]"
        >
          Sign up
        </p>
      </div>
      <div className="flex flex-row w-fit">
        <div
          className={`flex flex-col w-[300px]`}
        >
          <p
            onClick={() => {
              setMoveRight(false);
              setLogin(false);
            }}
          >
            Back
          </p>
          <LoginFormPage />
        </div>
        <div
          className={`flex flex-col w-[300px]`}
        >
          <p
            onClick={() => {
              setMoveRight(false);
              setSignup(false);
            }}
          >
            Back
          </p>
          <SignupFormPage />
        </div>
      </div>
      </div>

    </div>
  );
}
