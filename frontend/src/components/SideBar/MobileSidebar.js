import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RecentStats from "./RecentStats";
import * as sessionActions from "../../store/session";

export default function MobileSideBar({ setSearch }) {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
  };

  return (
    <div className="text-white w-screen bg-slate-800 absolute h-15">
        <div className="flex flex-row justify-content-between items-center">
            <div className="flex flex-row items-center">
                <img src={require("../../assets/icons/profile.jpg")} onClick={() => setShowMenu(!showMenu)} className="h-14 p-2 rounded-full" alt='profile'/>
                <p className="pl-4">{user ? user.username : ""}</p>
            </div>
            <img
            src={require("../../assets/icons/logout.png")}
            onClick={(e) => handleLogOut(e)}
            className="h-8 cursor-pointer"
            alt="logout"
            />

        </div>
      {showMenu ? (
        <div className="fixed flex bg-slate-800 w-full h-screen p-2 z-30">
          {user ? (
            <div className="flex flex-col w-full -r-2">
              <div className="w-full flex flex-row items-center justify-between h-fit">
              </div>
              <RecentStats setSearch={setSearch} setShowMenu={setShowMenu}/>
            </div>
          ) : (
            <div>
              <p>Login</p>
              <p>Create an account</p>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
