import { React, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import logo from "../../assets/images/searchdeck-favicon.png";
import profileImg from "../../assets/icons/profile.jpg";
import * as sessionActions from "../../store/session";

function Navigation() {
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li>
                <NavLink to="/login">Log In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
            </li>
        );
    }
    const handleLogOut = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        navigate("/");
    };

    const handleNavigate = () => {
        if (sessionUser && sessionUser.id) {
            navigate("/search")
        }
        else {navigate('/')}
    }

    return (
        <div className="h-[5%] w-screen fixed flex p-2 border-b border-zinc-500 flex flex-row items-center justify-between text-white">
            <div
                className="flex flex-row items-center cursor-pointer"
                onClick={handleNavigate}
            >
                <img src={logo} className="flex h-10" />
                <h1 className="text-2xl p-2">SearchDeck</h1>
            </div>
            {sessionUser ? (
                <div className="flex justify-items-center">
                    <div
                        className="flex flex-col items-end  cursor-pointer"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <img
                            src={profileImg}
                            className="rounded-full h-10"
                            alt="profile"
                        />
                        {showMenu ? (
                            <div className="flex flex-col fixed h-fit bg-zinc-950 rounded w-32 mt-12 p-2 border">
                                <div
                                    className="w-full h-10 rounded flex items-center hover:bg-zinc-600 p-1"
                                    onClick={(e) => handleLogOut(e)}
                                >
                                    <p>Logout</p>
                                </div>
                                {/* <img
                        src={require("../../assets/icons/logout.png")}
                        className="h-8 cursor-pointer"
                        alt="logout"
                        /> */}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-row items-center">
                    <div
                        className="flex items-center justify-center p-2 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        <p>Login</p>
                    </div>
                    <div
                        className="flex items-center justify-center border rounded-full p-1 px-2 cursor-pointer hover:bg-zinc-700"
                        onClick={() => navigate("/signup")}
                    >
                        <p>Create an Account</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navigation;
