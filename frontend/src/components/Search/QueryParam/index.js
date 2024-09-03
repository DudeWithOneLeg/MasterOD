import { useState, useRef, useEffect } from "react";

export default function QueryParam({ param, query, setQuery, index }) {
  const [currParam, setCurrParam] = useState(param);
  const [paramValue, setParamValue] = useState(
    currParam.split(":")[1]?.split('"').join("") || ""
  );
  const [qparam, setParam] = useState(currParam.split(":")[0]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const queryParamRef = useRef(null);

  // const handleUpdate = (e) => {
  //   e.preventDefault();
  //   return
  // };

  const handleDelete = () => {
    setQuery((prevQuery) => prevQuery.filter((_, idx) => idx !== index));
    return;
  };

  useEffect(() => {
    if (currParam) {
      const newParam = `${qparam}:${paramValue}`;
      setQuery((prevQuery) => {
        const newQuery = [...prevQuery];
        newQuery[index] = newParam;
        return newQuery;
      });
      // console.log('herroo', query)
    }
  }, [paramValue, qparam, index, setQuery]);

  return (
    <div
      className={`p-1 flex justify-content-end items-center rounded mr-1 mt-1 h-fit w-fit ${
        param.split(":")[0].includes("-") ? "bg-red-400" : "bg-slate-500"
      }`}
      o
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      id="query-param"
      ref={queryParamRef}
    >
      <div className="flex flex-row w-fit">
        <div className="w-fit flex">
          <p>{qparam}: </p>
        </div>
        <div>
          <input
            className="flex text-black rounded ml-1 w-36 outline-none px-1"
            value={paramValue}
            onChange={(e) => setParamValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex w-7">
        {showDeleteIcon ? (
          <img
            src={require("../../../assets/images/trash.png")}
            onClick={handleDelete}
            className="flex h-6 w-8 rounded ml-1 hover:bg-red-600 align-self-start cursor-pointer"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
