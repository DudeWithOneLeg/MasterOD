import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MobileRecentStat({ object, setSearch, setShowMenu }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const path = window.location.pathname

    return (
        <div className={`p-2`}>
            <div
                className={`p-2 flex flex-row items-center cursor-pointer justify-content-between rounded ${path.includes(object.path) ? 'bg-amber-800' : (object.path ? 'hover:bg-zinc-700' : '')} `}
                onClick={() => setHover(true)}
            >
                <h1 className="text-2xl">
                    {object.stat}
                </h1>

            </div>
            {(hover && object?.options?.length) || (path.includes(object.subPath)) ?
                <div
                    className="w-full h-fit bg-zinc-800 shadow-inner shadow-2xl p-2">
                    {object?.options.map(option => {
                        return (
                            <div className={`p-2 px-4 flex flex-row items-center cursor-pointer justify-content-between ${(path.includes(option.path) || (option.path === '/search/all' && path === '/search')) ? 'bg-amber-800' : 'hover:bg-zinc-700'}`}
                                onClick={() => {
                                    setShowMenu(false)
                                    setSearch(false)
                                    navigate(option.path)
                                }}>
                                <h1>{option.name}</h1>
                            </div>
                        )
                    })}
                </div> : <></>}
        </div>
    );
}
