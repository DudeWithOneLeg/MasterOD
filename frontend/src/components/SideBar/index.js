import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import * as searchActions from "../../store/search";
import * as resultActions from "../../store/result";
import SignupFormPage from "../SignupFormPage";
import LoginFormPage from "../LoginFormPage";
// import SearchBar from "../SearchBar";

export default function SideBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const recentQueries = useSelector((state) => state.search.recentQueries);
  const recentSavedResults = useSelector(
    (state) => state.results.recentSavedResults
  );
  const [hide, setHide] = useState(true);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [slide, setSlide] = useState("");
  const [signupSlideDown, setSignupSlideDown] = useState("");
  const [loginSlide, setLoginSlide] = useState("w-[300px]");
  const timeFunc = (dateTime) => {
    // date = new Date(date)
    dateTime = new Date(dateTime);
    const currDateTime = new Date(Date.now());
    const timeDifference = currDateTime - dateTime;
    const secondsDifference = timeDifference / 1000;
    const minutesDifference = timeDifference / (1000 * 60);
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (secondsDifference < 60) dateTime = secondsDifference.toFixed(0) + "s ";
    else dateTime = minutesDifference.toFixed(0) + "min ";

    if (minutesDifference > 60) dateTime = hoursDifference.toFixed(0) + "h ";
    if (hoursDifference > 24) dateTime = daysDifference.toFixed(0) + "d ";

    return dateTime.toString();
  };
  const navBarStats = [
    {
      stat: "Saved Queries",
      recent: <></>,
    },
    {
      stat: "Recent Queries",
      recent:
        recentQueries && recentQueries.length ? (
          recentQueries.slice(0, 5).map((query) => {
            return (
              <div className="flex flex-row truncate text-sm py-1 px-2">
                <p className="pr-1 text-gray-400">
                  {timeFunc(query.createdAt)}
                </p>
                <p className="">{query.query.split(";").join(" ")}</p>
              </div>
            );
          })
        ) : (
          <></>
        ),
    },
    {
      stat: "Visited",
      recent: <></>,
    },
    {
      stat: "Saved Results",
      recent:
        recentSavedResults && Object.values(recentSavedResults).length ? (
          Object.values(recentSavedResults)
            .reverse()
            .map((result) => {
              return (
                <div className="flex flex-row truncate text-sm py-1 px-2">
                  <p className="pr-1 text-gray-400">
                    {timeFunc(result.createdAt)}
                  </p>
                  <p className="">{result.title}</p>
                </div>
              );
            })
        ) : (
          <></>
        ),
    },
    {
      stat: "Site History",
      recent: <></>,
    },
  ];
  const obj = {};


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
    // else {setSlide('ml-[-600px')}
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
      // console.log("login off");
    }
  }, [login]);

  useEffect(() => {
    dispatch(searchActions.getRecentQueries());
    dispatch(resultActions.getRecentSavedResults());
    // console.log('yo')
  }, [dispatch]);

  useEffect(() => {
    if (!login && !hide && loginSlide.includes("overflow-hidden")) {
      console.log("58-1");
      if (slide == "ml-[-300px]") {
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
            {Object.values(navBarStats).map((object) => {
              return (
                <div>
                  <h1 className="p-2 border-b">{object.stat}</h1>
                  <div>{object.recent}</div>
                </div>
              );
            })}
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
              </div>
            </div>
            <div className="flex flex-row w-fit h-fit">
              {login ? (
                <div
                  className={`flex flex-col transition-all duration-700 ease-in-out ${loginSlide} p-4`}
                >
                  <img
                    onClick={async () => {
                      setHide(true);
                      await setTimeout(async () => {
                        setLogin(false);
                      }, 500);
                    }}
                    src="/icons/arrow_back_2.png"
                    className="w-10 hover:bg-slate-600 rounded-full p-1.5 cursor-pointer"
                  />
                  <LoginFormPage setLogin={setLogin} setSignup={setSignup} />
                </div>
              ) : (
                <></>
              )}
              {signup ? (
                <div
                  className={`flex flex-col w-[300px] transition-all ease-in-out duration-700 p-4 ${signupSlideDown}`}
                >
                  <div className="flex flex-row items-end">
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
                      src="/icons/arrow_back_2.png"
                      className="w-10 hover:bg-slate-600 rounded-full p-1.5 cursor-pointer"
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
  );
}
