import { useState } from "react";

export default function QueryParam({ param, query, setQuery }) {
    const [hover, setHover] = useState(false);
  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`mx-1 flex justify-content-end items-center rounded px-2 py-1 my-1 h-fit ${
        (param.split(":")[0].includes("-") ? "bg-red-200" : "bg-green-200")
      }`}
      id='query-param'
    >
      {param.split(':').join(': ')}
      {/* <div className="w-full">

        </div> */}
      {hover && (
        <div className="flex flex-row justify-self-end absolute w-fit px-2 py-1 bg-gray-300">
          <p className="w-full pr-1">Remove</p>
          <p className="w-full">Edit</p>
        </div>
      )}
    </div>
  );
}
