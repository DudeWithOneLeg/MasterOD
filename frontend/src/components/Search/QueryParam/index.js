import { useState, useRef, useEffect, useContext } from "react";
import { SearchContext } from "../../../context/SearchContext";

export default function QueryParam({ param, index }) {
  const {setQuery} = useContext(SearchContext)
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
    }
  }, [paramValue, qparam, index, setQuery]);

  return (
    <div
      className={`p-1 flex justify-content-end items-center rounded mr-1 mt-1 h-fit w-fit ${
        param.split(":")[0].includes("-") ? "bg-amber-700" : "bg-zinc-700"
      }`}
      o
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      id="query-param"
      ref={queryParamRef}
    >
      <div className="flex flex-row w-fit">
        <div className="w-fit flex text-white text-xl px-1 border-b">
          <p>{qparam}: </p>
        </div>
        <div>
          <input
            className="flex text-white rounded ml-1 w-32 outline-none px-1 bg-zinc-800 h-full poppins-light"
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
