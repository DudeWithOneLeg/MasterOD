import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/images/searchdeck-favicon.png";
import profileImg from "../../assets/icons/profile.png";
import * as sessionActions from "../../store/session";

function Navigation() {
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = (e) => {
        e.preventDefault();
        setShowMenu(false);
        dispatch(sessionActions.logout()).then(async () => {
            navigate("/");
        });
    };

    const handleNavigate = () => {
        if (sessionUser && sessionUser.id) {
            navigate("/search");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="h-[5%] w-screen fixed flex flex flex-row items-center text-white bg-zinc-900 z-20">
            <div className="w-[316px] h-full" />
            <div className="w-4/5 flex flex-row items-center justify-between">

                <div className="flex flex-row items-center">
                    <div
                        className="flex flex-row items-center cursor-pointer items-center "
                        onClick={handleNavigate}
                    >
                        <img src={logo} className="flex h-10" />
                        <h1 className="text-3xl p-2 poppins-light">SearchDeck</h1>
                    </div>
                    <div className="w-4" />
                    <div className="flex flex-row text-zinc-300 text-xl items-center h-fit">
                        <p
                            className="cursor-pointer"
                            onClick={() => {
                                navigate('/guide')
                            }}
                        >
                            Guide
                        </p>
                        {/* <p
                            className="cursor-pointer pl-2"
                            onClick={() => setUnderline("option")}
                        >
                            Option
                        </p> */}
                    </div>
                </div>
                {sessionUser ? (
                    <div className="flex justify-items-center">
                        <div
                            className="flex flex-col items-end  cursor-pointer"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <div className="flex flex-row items-center">
                                <div className="flex flex-row items-center justify-center border-2 border-green-400 bg-green-200 rounded p-1 px-2 text-green-600">
                                    <p>Free</p>
                                </div>
                                <span className="w-2" />
                                <img
                                    src={profileImg}
                                    className="rounded-full h-10"
                                    alt="profile"
                                />
                            </div>
                            {showMenu ? (
                                <div className="flex flex-col fixed h-fit bg-zinc-700 rounded w-32 mt-12 p-2 z-10">
                                    <div
                                        className="w-full h-10 rounded flex items-center hover:bg-zinc-600 p-1 cursor-pointer"
                                        onClick={(e) => handleLogOut(e)}
                                    >
                                        <p>Logout</p>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row items-center">
                        <div
                            className="flex items-center justify-center p-2 cursor-pointer text-xl"
                            onClick={() => navigate("/login")}
                        >
                            <p>Login</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navigation;
