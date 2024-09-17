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
                className={`p-2 flex flex-row items-center cursor-pointer justify-content-between rounded mt-3 ${path === object.path ? 'bg-zinc-500':'hover:bg-zinc-700'}`}
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
                className="text-xl poppins-regular"
                >
                    {object.stat}
                </h1>
                <div className="h-8 flex items-center">
                    {hover ? (
                        <img src={arrowforward} className="h-6 rounded-full" />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* <div className="h-[140px]">{object.recent}</div> */}
        </div>
    );
}
