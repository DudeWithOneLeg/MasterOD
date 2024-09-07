import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
const arrowforward = require("../../../assets/images/arrow-forward-2.png");

export default function MobileRecentStat({ object, setSearch, setShowMenu }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const path = window.location.pathname

    return (
        <div className={`p-2`}>
            <div
                className={`p-2 flex flex-row items-center cursor-pointer justify-content-between rounded ${path === object.path ? 'bg-zinc-500':'hover:bg-zinc-700'}`}
                onClick={() => {
                    navigate(object.path);
                    setSearch(false);
                    if (isMobile) {
                        setShowMenu(false);
                    }
                }}
            >
                <h1
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="text-2xl"
                >
                    {object.stat}
                </h1>
                <div className="h-8 flex items-end">
                    {hover ? (
                        <img src={arrowforward} className="h-6 rounded-full" />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
