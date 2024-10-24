import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MobileRecentStat from "./MobileRecentStat";

export default function RecentStat({ object, setSearch, setShowMenu }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const path = window.location.pathname

    if (isMobile) {
        return <MobileRecentStat object={object} setSearch={setSearch} setShowMenu={setShowMenu} />
    }
    else return (
        <div>
            <div
                className={`p-2 flex flex-row items-center cursor-pointer justify-content-between rounded text-2xl ${path.includes(object.path) ? 'bg-amber-800' : (object.path ? 'hover:bg-zinc-700' : '')} shadow-2xl`}
                onClick={() => {
                    if (object.path) {

                        navigate(object.path);
                        setSearch(false);
                        if (isMobile) {
                            setShowMenu(false);
                        }
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
            </div>
            {(hover && object?.options?.length) || (path.includes(object.subPath)) ?
                <div
                    className="w-full h-fit bg-zinc-800 shadow-inner shadow-2xl p-2"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}>
                    {object?.options.map(option => {
                        return (
                            <div className={`p-2 px-4 flex flex-row items-center cursor-pointer justify-content-between ${(path.includes(option.path) || (option.path === '/search/all' && path === '/search')) ? 'bg-amber-800' : 'hover:bg-zinc-700'}`} onClick={() => navigate(option.path)}>
                                <h1>{option.name}</h1>
                            </div>
                        )
                    })}
                </div> : <></>}
        </div>
    );
}
