import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom";
import RecentStats from "./RecentStats";
import logo from "../../assets/images/searchdeck-favicon.png";
import * as sessionActions from "../../store/session";
const menuIcon = require("../../assets/images/menu-icon.png")
const profileIcon = require("../../assets/icons/profile.jpg")

export default function MobileSideBar({ setSearch }) {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate("/");
  };

  const handleNavigate = () => {
    if (user && user.id) {
        navigate("/search")
    }
    else {navigate('/')}
}

  return (
    <div className="text-white w-screen bg-zinc-900 fixed h-[5vh] z-30 border-b border-zinc-500">
      {user ? (
        <div className="grid grid-flow-col grid-cols-3 justify-items-stretch items-center w-full">
          <div className="flex flex-row items-center justify-self-start">
            <img
              src={menuIcon}
              onClick={() => setShowMenu(!showMenu)}
              className="h-14 p-2 rounded-full"
              alt="profile"
            />
          </div>
          <div
                className="flex flex-row items-center cursor-pointer justify-self-center w-fit"
                onClick={handleNavigate}
            >
                <img src={logo} className="flex h-10" alt='search deck logo'/>
                <h1 className="text-2xl p-2">SearchDeck</h1>
            </div>
        </div>
      ) : (
        <div className="flex flex-row h-full items-center justify-between w-full">
          <p className="p-1 rounded border !border-zinc-500 mx-1" onClick={() => navigate('/signup')}>
            Create an account
          </p>
          <p className="p-1 rounded border !border-zinc-500 mx-1" onClick={() => {return navigate('/login')}}>Login</p>
        </div>
      )}
      {showMenu ? (
        <div className="fixed flex bg-zinc-900 w-full h-fit pb-2 px-2 z-30">
          {user ? (
            <div className="flex flex-col w-full -r-2 divide-y ">
              <div className="w-full flex flex-row items-center justify-between h-fit">
              <div className="flex flex-row items-center">
            <img
              src={profileIcon}
              onClick={() => setShowMenu(!showMenu)}
              className="h-14 p-2 rounded-full"
              alt="profile"
            />
            <p className="pl-4">{user ? user.username : ""}</p>
          </div>
          <img
            src={require("../../assets/icons/logout.png")}
            onClick={(e) => handleLogOut(e)}
            className="h-8 cursor-pointer"
            alt="logout"
          />
              </div>
              <RecentStats setSearch={setSearch} setShowMenu={setShowMenu} />
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
