import { useState, useContext } from "react";
import { SearchContext } from "../../../context/SearchContext";

export default function Parameter({ param, text }) {
  const {query, setQuery} = useContext(SearchContext)
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.split(param)[1]) {

      const parsed = input.split(text).join(param);
      const q = query;
      setQuery([...q, parsed]);
      setInput("");
    }
  };
  return (
    <form
      className="flex flex-row items-center p-2 w-full text-white"
      id="parameter"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="flex flex-row w-full rounded border !border-zinc-500">
        <div className="rounded-left flex-shrink-0 px-1 text-white">
          {input.split(text)[1] ? (
            <p className="w-fit">{text + input.split(text)[1]}</p>
          ) : (
            <p className="w-fit">{text}</p>
          )}
        </div>
        {showInput && (
          <input
            id="parameter-input"
            className={`pl-1 pr-0 outline-none w-full bg-zinc-600 ${
              !input.split(param)[1] ? "rounded-right" : ""
            }`}
            onChange={(e) => setInput(param + e.target.value || "")}
            placeholder={""}
            value={input.split(":")[1] ? input.split(":")[1] : ""}
          />
        )}
        {input && input.split(param)[1] && (
          <button
            type="submit"
            className="rounded-right bg-slate-400 hover:bg-slate-600 "
          >
            <img src={require("../../../assets/images/plus.png")} className="w-fit mr-0 self-end px-1" />
          </button>
        )}
      </div>
    </form>
  );
}
