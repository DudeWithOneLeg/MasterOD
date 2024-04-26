import { useState } from "react";

export default function QueryParam({ param, query, setQuery }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`mx-1 flex justify-content-end items-center rounded ${hover ? '' : 'px-2 py-1'} my-1 h-fit ${
        param.split(":")[0].includes("-") ? "bg-red-200" : "bg-slate-500"
      }`}
      id="query-param"
    >
      {!hover && <div>
        <p>{param.split(":").join(": ")}</p>
      </div>}
      {hover && (
        <div className="rounded flex flex-row justify-self-end w-full h-full px-2 py-1 bg-slate-600">
          <p className="w-full px-1 mr-1 hover:bg-red-400">Remove</p>
          <p className="w-full px-1 hover:bg-slate-400">Edit</p>
        </div>
      )}
    </div>
  );
}
