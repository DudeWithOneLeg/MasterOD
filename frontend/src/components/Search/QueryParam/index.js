import { useState, useRef, useEffect } from "react";

export default function QueryParam({ param, query, setQuery, index }) {
  const [paramValue, setParamValue] = useState(
    param.split(":")[1]?.split('"').join("") ||  ''
  );
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const queryParamRef = useRef(null);

  // const handleUpdate = (e) => {
  //   e.preventDefault();
  //   return
  // };

  const handleDelete = () => {
    const newParams = query.filter((param, idx) => {
      return (idx !== index);
    });
    setQuery(newParams);
    return;
  };

  useEffect(() => {
    if (param) {
      const newParam = param.split(":")[0] + ":" + paramValue;
    const arr = query;
    arr[index] = newParam;
    setQuery(arr);
    }
  }, [paramValue]);

  return (
    <div
      className={`mx-1 flex justify-content-end items-center rounded my-1 p-1 h-fit ${
        param.split(":")[0].includes("-") ? "bg-red-200" : "bg-slate-500"
      }`}
      o
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      id="query-param"
      ref={queryParamRef}
    >
      <div className="relative flex flex-row">
        <p>{param.split(":")[0]}: </p>
        <div>
          <input
            className="text-black rounded ml-1 w-32 outline-none"
            value={paramValue}
            onChange={(e) => setParamValue(e.target.value)}
          />
        </div>
      </div>
      {showDeleteIcon ? (
        <img
          src={require("../../../assets/images/trash.png")}
          onClick={handleDelete}
          className="flex h-6 rounded-full hover:bg-red-600 align-self-start cursor-pointer"
        />
      ) : (
        <div className="w-6"></div>
      )}
    </div>
  );
}
