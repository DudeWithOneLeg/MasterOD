import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import SignupFormPage from "../SignupFormPage";
import LoginFormPage from "../LoginFormPage";

export default function SideBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [hide, setHide] = useState(true);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [slide, setSlide] = useState("");
  const [signupSlideDown, setSignupSlideDown] = useState("");
  const [loginSlide, setLoginSlide] = useState("w-[300px]");

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setHide(true);
  };

  useEffect(() => {
    if (login && signup) {
      setSlide("ml-[-1200px]");
      setSignupSlideDown("ml-[300px]");

      setTimeout(async () => {
        setLoginSlide("w-0");
        setSlide("ml-[-900px]");

        setTimeout(async () => {
          setLogin(false);

          setTimeout(async () => {
            if (!login && signup) setSlide("ml-[-600px]");
          }, 700);
        }, 700);
      }, 700);
    }
  }, [signup]);

  useEffect(() => {
    console.log("login slide:", loginSlide);
  }, [loginSlide]);

  useEffect(() => {
    if (login) {
      console.log("login on");
      setLoginSlide("w-[300px]");
    } else {
      setLoginSlide("w-0 overflow-hidden");
      console.log("login off");
    }
  }, [login]);

  useEffect(() => {
    if (!login && !hide && loginSlide.includes("overflow-hidden")) {
      setSlide("ml-[-900px]");
      console.log("900");
    } else if (hide) {
      setSlide("ml-[-300px]");
      console.log("300");
    } else {
      setSlide("ml-[-600px]");
      console.log("600");
    }
    console.log("hide:", hide);
  }, [hide]);

  useEffect(() => {
    if (user) {
      setSlide("ml-[0px]");
    } else setSlide("ml-[-300px]");
  }, [user]);

  return (
    <div className="h-full w-[300px] bg-slate-800 overflow-hidden flex flex-row text-slate-100 rounded border-2 border-slate-600">

      <div
        className={`flex flex-row transition-all duration-700 ease-in-out ${slide}`}
      >
        <div className={`p-4 w-[300px]`}>
          <div className="flex flex-row items-center">
            <img src="icons/profile.jpg" className="rounded-full h-14"></img>
            <p className="pl-4">{user ? user.username : ""}</p>
          </div>
          <div className={`p-4 text-lg`}>
            <h1 className="p-2">Saved Queries</h1>
            <h1 className="p-2">Recent Queries</h1>
            <div>
              {user &&
                user.recentQueries &&
                user.recentQueries.slice(0, 5).map((query) => {
                  return (
                    <p className="truncate text-sm p-1 pl-4">
                      {query.query.split(";").join(" ")}
                    </p>
                  );
                })}
            </div>
            <p
              className={`p-2 transition-all duration-700 ease-in-out ${
                user ? "ml-0" : "-ml-96"
              }`}
            >
              Visited
            </p>
            <p
              className={`p-2 transition-all duration-700 ease-in-out ${
                user ? "ml-0" : "-ml-96"
              }`}
            >
              Saved Sites
            </p>
            <p
              className={`p-2 transition-all duration-700 ease-in-out ${
                user ? "ml-0" : "-ml-96"
              }`}
            >
              Site History
            </p>
          </div>
          <p onClick={(e) => handleLogOut(e)}>Sign out</p>
        </div>

        {!user ? (
          <>
            <div
              className={`flex flex-col text-lg h-1/5 w-[300px] items-center justify-content-center`}
            >
              <div>
                <p
                  onClick={() => {
                    // setMoveRight(true);
                    setHide(false);
                    setLogin(true);
                  }}
                  className="mb-3"
                >
                  Log in
                </p>
                <p
                  onClick={() => {
                    // setMoveRight(true);
                    setHide(false);
                    setSignup(true);
                  }}
                  className=""
                >
                  Sign up
                </p>
              </div>
            </div>
            <div className="flex flex-row w-fit h-fit">
              {login ? (
                <div
                  className={`flex flex-col transition-all duration-700 ease-in-out ${loginSlide}`}
                >
                  <p
                    onClick={async () => {
                      // setLogin(false);
                      setHide(true);
                      await setTimeout(async () => {
                        setLogin(false);
                      }, 500);
                    }}
                  >
                    Back
                  </p>
                  <LoginFormPage setLogin={setLogin} setSignup={setSignup} />
                </div>
              ) : (
                <></>
              )}
              {signup ? (
                <div
                  className={`flex flex-col w-[300px] transition-all ease-in-out duration-700 ${signupSlideDown}`}
                >
                  <p
                    onClick={async () => {
                      // ;
                      setHide(true);
                      // if (!signup && login) setLogin(false)
                      await setTimeout(async () => {
                        setSignup(false);
                        setLogin(false);
                      }, 500);
                    }}
                  >
                    Back
                  </p>
                  <SignupFormPage setSignup={setSignup} setHide={setHide} />
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
