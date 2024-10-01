import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MobileRecentStat from "./MobileRecentStat";
const arrowforward = require("../../../assets/images/arrow-forward-2.png");

export default function RecentStat({ object, setSearch, setShowMenu }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const path = window.location.pathname

    if (isMobile) {
        return <MobileRecentStat object={object} setSearch={setSearch} setShowMenu={setShowMenu}/>
    }
    else return (
        <div className={``}>
            <div
                className={`p-1 flex flex-row items-center cursor-pointer justify-content-between rounded transition-text duration-300 ${path === object.path || (path === '/search' && object.path === '/search/all')? 'bg-amber-800 text-2xl':'hover:text-2xl text-xl'}`}
                onClick={() => {
                    navigate(object.path);
                    setSearch(false);
                    if (isMobile) {
                        setShowMenu(false);
                    }
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <h1
                className="poppins-regular"
                >
                    {object.stat}
                </h1>
                <div className="h-6 w-6 flex items-center">
                    {hover ? (
                        <img src={arrowforward} className="h-6 rounded-full" alt="arrow forward"/>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
