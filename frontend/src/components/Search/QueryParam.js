import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { SearchContext } from "../../context/SearchContext";

export default function QueryParam({ param, index }) {
  const { setQuery, query } = useContext(SearchContext);
  const [paramValue, setParamValue] = useState(
    param.split(":")[1]?.split('"').join("") || ""
  );
  const [qparam, setParam] = useState(param.split(":")[0]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const queryParamRef = useRef(null);

  const handleDelete = useCallback(() => {
    setQuery(prevQuery => prevQuery.filter(p => p !== param));
  }, [setQuery, param]);

  const handleParamValueChange = useCallback((e) => {
    const newValue = e.target.value;
    setParamValue(newValue);
    setQuery(prevQuery => {
      const newQuery = [...prevQuery];
      newQuery[index] = `${qparam}:${newValue}`;
      return newQuery;
    });
  }, [qparam, index, setQuery]);

  useEffect(() => {
    if (param) {
      const [newQparam, newParamValue] = param.split(":");
      setParam(newQparam);
      setParamValue(newParamValue?.split('"').join("") || "");
    }
  }, [param]);

  return (
    <div
      className={`p-1 flex justify-content-end items-center rounded mr-1 mt-1 h-fit w-fit ${
        qparam.includes("-") ? "bg-amber-700" : "bg-zinc-700"
      }`}
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
            onChange={handleParamValueChange}
          />
        </div>
      </div>
      <div className="flex w-7">
        {showDeleteIcon && (
          <img
            src={require("../../assets/images/trash.png")}
            onClick={handleDelete}
            className="flex h-6 w-8 rounded ml-1 hover:bg-red-600 align-self-start cursor-pointer"
            alt="Delete"
          />
        )}
      </div>
    </div>
  );
}
