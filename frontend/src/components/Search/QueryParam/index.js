import { useState, useRef, useEffect } from "react";

export default function QueryParam({ param, query, setQuery, index }) {
  const [paramValue, setParamValue] = useState(param.split(':')[1]);
  const [show, setShow] = useState(false);
  const [showOptionsIcon, setShowOptionsIcon] = useState(false);
  const [edit, setEdit] = useState(false);
  const queryParamRef = useRef(null);
  const [queryParamWidth, setQueryParamWidth] = useState(0)
  const optionsRef = useRef(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    const newParam = param.split(':')[0] + ':' + paramValue
    const arr = query
    arr[index] = newParam
    setQuery(arr)

    setEdit(false)
    setShow(false)
  };

  // useEffect(() => {

  //   if (queryParamRef.current) {
  //     setQueryParamWidth(queryParamRef.current.getBoundingClientRect().width)
  //   }
  // },[queryParamRef.current])

  // useEffect(() => {
  //   if (optionsRef.current) {
  //     optionsRef.current.style.width = queryParamWidth + 'px';
  //   }
  // }, [queryParamWidth]);


  return (
    <div
      className={`mx-1 flex justify-content-end items-center rounded my-1 p-1 h-fit ${
        param.split(":")[0].includes("-") ? "bg-red-200" : "bg-slate-500"
      }`}
      o
      onMouseEnter={() => setShowOptionsIcon(true)}
      onMouseLeave={() => setShowOptionsIcon(false)}
      id="query-param"
      ref={queryParamRef}
    >
      <div
        className="relative flex flex-row"
      >
        {edit ? <p>{param.split(":")[0]}: </p> : ""}
        {!edit ? (
          <p>{`${param.split(":")[0]}: ${paramValue}`}</p>
        ) : (
          <form onSubmit={(e) => handleUpdate(e)}>
            <input
              className="text-black rounded ml-1 outline-none"
              value={paramValue}
              onChange={(e) => setParamValue(e.target.value)}
            />
          </form>
        )}
        {show && !edit && (
          <div
            className={`absolute top-[30px] rounded flex flex-row justify-self-end w-full h-[100%] mx-1 px-1 bg-slate-800`}
            ref={optionsRef}
          >
            <p className="w-full px-1 mr-1 hover:bg-red-400 text-center">Remove</p>
            <p
              className="w-full px-1 hover:bg-slate-400 text-center"
              onClick={() => setEdit(true)}
            >
              Edit
            </p>
          </div>
        )}

      </div>
      {showOptionsIcon ?
        <img src={require('../../../assets/icons/options.png')}
        onClick={() => setShow(!show)}
          className="flex h-4 rounded-full hover:bg-slate-600 align-self-start"/> :

          <div className="w-4"></div>}

    </div>
  );
}
