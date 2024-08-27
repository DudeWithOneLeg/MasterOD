import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
const arrowforward = require("../../../assets/images/arrow-forward-2.png");

export default function RecentStat({ object, setSearch, setShowMenu }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false)

  return (
    <div>
      <div className="p-2 border-b flex flex-row align-items-end cursor-pointer justify-content-between"  onClick={() => {
        navigate(object.path)
        setSearch(false)
        if (isMobile) {
          setShowMenu(false)
        }
        }}>
        <h1 onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{object.stat}</h1>
        <div className='h-8 flex items-end'>
        {hover ? <img src={arrowforward} className="h-6 rounded-full"/> : <></>}

        </div>
      </div>
      <div className="h-[140px]">{object.recent}</div>
    </div>
  );
}
