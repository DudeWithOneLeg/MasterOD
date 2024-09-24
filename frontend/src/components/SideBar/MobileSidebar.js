import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RecentStats from "./RecentStats";
import * as sessionActions from "../../store/session";
import menuIcon from "../../assets/images/menu-icon.png";
import logo from "../../assets/images/searchdeck-favicon.png";

export default function MobileSideBar({ setSearch }) {
    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = (e) => {
        e.preventDefault();
        setShowMenu(false);
        dispatch(sessionActions.logout()).then(async () => {

            navigate("/");
        })
    };

    const handleNavigate = () => {
        if (user && user.id) {
            navigate("/search")
        }
        else {navigate('/')}
        setShowMenu(false)
    }

    return (
        <div className="text-white w-screen bg-zinc-900 fixed h-[5vh] z-30 border-b border-zinc-500">
            {user ? (
                <div className="grid grid-cols-3 justify-content-between items-center">
                    <img
                        src={menuIcon}
                        onClick={() => setShowMenu(!showMenu)}
                        className="h-14 p-2 rounded-full"
                        alt="profile"
                    />
                    <div
                        className="flex flex-row items-center justify-center cursor-pointer justify-self-center"
                        onClick={handleNavigate}
                    >
                        <img src={logo} className="flex h-10" />
                        <h1 className="text-2xl p-2">SearchDeck</h1>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 h-full items-center justify-between w-full text-white">
                    <p
                        className="p-1 rounded !bg-indigo-700 mx-1 justify-self-start"
                        onClick={() => navigate("/signup")}
                    >
                        Create an account
                    </p>
                    <div
                        className="flex flex-row items-center justify-center cursor-pointer text-white"
                        onClick={handleNavigate}
                    >
                        <img src={logo} className="flex h-10" />
                        <h1 className="text-2xl p-2">SearchDeck</h1>
                    </div>
                    <p
                        className="p-1 rounded bg-indigo-700 mx-1 justify-self-end"
                        onClick={() => {
                            return navigate("/login");
                        }}
                    >
                        Login
                    </p>
                </div>
            )}
            {showMenu ? (
                <div className="fixed flex bg-zinc-900 w-full h-screen px-2 pb-2 z-30">
                    {user ? (
                        <div className="flex flex-col w-full -r-2 divide-y ">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center">
                                    <img
                                        src={require("../../assets/icons/profile.jpg")}
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="h-14 p-2 rounded-full"
                                        alt="profile"
                                    />
                                    <p className="pl-4">
                                        {user ? user.username : ""}
                                    </p>
                                </div>
                                <img
                                    src={require("../../assets/icons/logout.png")}
                                    onClick={(e) => handleLogOut(e)}
                                    className="h-8 cursor-pointer"
                                    alt="logout"
                                />
                            </div>
                            <div className="w-full flex flex-row items-center justify-between h-fit"></div>
                            <RecentStats
                                setSearch={setSearch}
                                setShowMenu={setShowMenu}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
