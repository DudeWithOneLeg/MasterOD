import { useState } from "react";
import { useNavigate } from "react-router-dom";
const arrowforward = require("../../../assets/icons/arrow_forward.png");

export default function RecentStat({ object, setSearch }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false)

  return (
    <div>
      <div className="p-2 border-b flex flex-row align-items-end cursor-pointer justify-content-between"  onClick={() => {
        navigate(object.path)
        setSearch(false)
        }}>
        <h1 onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{object.stat}</h1>
        {hover ? <img src={arrowforward} className="h-8 rounded-full"/> : <div className='h-8'></div>}
      </div>
      <div className="h-[140px]">{object.recent}</div>
    </div>
  );
}
