import { useState, useEffect, useRef } from "react";

export default function QueryParam({ param}) {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);
  const queryParamRef = useRef(null)
  const optionsRef = useRef(null)

  useEffect(() => {
    const width = queryParamRef.current.offsetWidth
    const height = queryParamRef.current.offsetHeight

    // if (hover) {
    //   setShow(true)
    //   queryParamRef.current.style.width = width + 'px'
    // }
    // else {
    //   setShow(false)
    //   queryParamRef.current.style.height = 'fit'
    // }
  },[hover])

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={`mx-1 flex justify-content-end items-center rounded my-1 p-1 h-fit ${
        param.split(":")[0].includes("-") ? "bg-red-200" : "bg-slate-500"
      }`}
      id="query-param"
      ref={queryParamRef}
    >
      {!show && <div>
        <p>{param.split(":").join(": ")}</p>
      </div>}
      {show && (
        <div className="rounded flex flex-row justify-self-end w-full h-full px-2 py-1 bg-slate-600"
        ref={optionsRef}>
          <p className="w-full px-1 mr-1 hover:bg-red-400">Remove</p>
          <p className="w-full px-1 hover:bg-slate-400">Edit</p>
        </div>
      )}
    </div>
  );
}
