import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {isMobile} from 'react-device-detect'
import MobileSideBar from "./MobileSidebar";
import * as sessionActions from "../../store/session";
import * as searchActions from "../../store/search";
import * as resultActions from "../../store/result";
import SignupFormPage from "../SignupFormPage";
import LoginFormPage from "../LoginFormPage";
import RecentStats from "./RecentStats";
// import SearchBar from "../SearchBar";

export default function SideBar({ setSearch, setQuery, setString }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    navigate('/')
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
    // else {setSlide('ml-[-600px')}
  }, [signup]);

  useEffect(() => {
    // console.log("login slide:", loginSlide);
  }, [loginSlide]);

  useEffect(() => {
    if (login) {
      // console.log("login on");
      setLoginSlide("w-[300px]");
    } else {
      setLoginSlide("w-0 overflow-hidden");
      // console.log("login off");
    }
  }, [login]);

  useEffect(() => {
    if (user) {
      dispatch(searchActions.getRecentQueries());
      dispatch(resultActions.getRecentSavedResults());
      dispatch(searchActions.getRecentSavedQueries());
      dispatch(resultActions.getRecentVisitedResults());
    }
    // console.log('yo')
  }, [dispatch, user]);

  useEffect(() => {
    if (!login && !hide && loginSlide.includes("overflow-hidden")) {
      console.log("58-1");
      if (slide === "ml-[-300px]") {
        setSlide("ml-[-600px]");
        // console.log('hit 1')
      } else {
        setSlide("ml-[-900px]");
        // console.log('hit 2')
      }

      // console.log(slide);
    } else if (hide) {
      setSlide("ml-[-300px]");
      // console.log('58-2');
    } else {
      setSlide("ml-[-600px]");
      // console.log("58-3");
    }
    // console.log(slide);
    // console.log("hide:", hide, login, slide, loginSlide);
  }, [hide]);

  useEffect(() => {
    if (user) {
      setSlide("ml-[0px]");
    } else setSlide("ml-[-300px]");
  }, [user]);

  const handleNewSearch = () => {
    setQuery([])
    setString('')
    navigate("/search")
  }

  if (isMobile) return <MobileSideBar setSearch={setSearch}/>

  return (
    <div>

    <div className="h-full w-[300px] bg-slate-800 overflow-hidden flex flex-row text-slate-100 rounded border-2 border-slate-600 p-2">
      <div
        className={`flex flex-row transition-all duration-700 ease-in-out ${slide}`}
      >
        {user ? (
          <div className={`p-4 w-[300px] flex flex-col justify-between h-full`}>
            <div className="flex flex-col">

              <div className="w-full flex flex-row items-center justify-between h-fit">
                <div className="flex flex-row items-center">
                  <img
                    src={require("../../assets/icons/profile.jpg")}
                    className="rounded-full h-14"
                    alt="profile"
                  ></img>
                  <p className="pl-4">{user ? user.username : ""}</p>
                </div>
                <img
                  src={require("../../assets/icons/logout.png")}
                  onClick={(e) => handleLogOut(e)}
                  className="h-8 cursor-pointer"
                  alt="logout"
                />
              </div>
              <div className={`p-4 text-lg`}>
                <div
                  onClick={handleNewSearch}
                  className="flex flex-row items-center cursor-pointer border-2 rounded hover:bg-slate-600"
                >
                  <img
                    src={require("../../assets/images/plus-white.png")}
                    className="h-8"
                    alt="new search"
                  />
                  New Search
                </div>
                <RecentStats setSearch={setSearch} />
              </div>
            </div>
            <div className="flex flex-col justify-self-end">
              Developed by :
              <a href='https://www.linkedin.com/in/romeo-galvan-9418b6225/' className="underline" target="_blank">Romeo (I need a job) Galvan</a>
            </div>
          </div>
        ) : (
          <div className="w-[300px]"></div>
        )}

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
                  className="mb-3 cursor-pointer hover:bg-slate-600 rounded text-center p-1"
                >
                  Log in
                </p>
                <p
                  onClick={() => {
                    // setMoveRight(true);
                    setHide(false);
                    setSignup(true);
                  }}
                  className="cursor-pointer hover:bg-slate-600 rounded text-center p-1"
                >
                  Sign up
                </p>
                {/* <p
                  onClick={() => {
                    // setMoveRight(true);
                    dispatch(sessionActions.login({credential: "demo@user.com", password: 'password'}))
                  }}
                  className="cursor-pointer hover:bg-slate-600 rounded text-center p-1"
                >
                  Demo Login
                </p> */}
              </div>
            </div>
            <div className="flex flex-row w-fit h-fit">
              {login ? (
                <div
                  className={`flex flex-col transition-all duration-700 ease-in-out ${loginSlide} p-4`}
                >
                  <div className="flex flex-row items-center">
                    <img
                      onClick={async () => {
                        setHide(true);
                        await setTimeout(async () => {
                          setLogin(false);
                        }, 500);
                      }}
                      src={require("../../assets/icons/arrow_back_2.png")}
                      className="w-10 hover:bg-slate-600 rounded-full p-1.5 cursor-pointer"
                      alt="back"
                    />
                    <h1 className="text-center">Login</h1>
                  </div>
                  <LoginFormPage setLogin={setLogin} setSignup={setSignup} />
                </div>
              ) : (
                <></>
              )}
              {signup ? (
                <div
                  className={`flex flex-col w-[300px] transition-all ease-in-out duration-700 p-4 ${signupSlideDown}`}
                >
                  <div className="flex flex-row items-center">
                    <img
                      onClick={async () => {
                        // ;
                        setHide(true);
                        // if (!signup && login) setLogin(false)
                        await setTimeout(async () => {
                          setSignup(false);
                          setLogin(false);
                        }, 500);
                      }}
                      src={require("../../assets/icons/arrow_back_2.png")}
                      className="w-10 hover:bg-slate-600 rounded-full p-1.5 cursor-pointer"
                      alt="back"
                    />
                    <h1 className="w-full text-center">Sign up</h1>
                  </div>
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
    </div>
  );
}
