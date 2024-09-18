import { useState, useContext } from "react";
import { SearchContext } from "../../../context/SearchContext";

export default function Parameter({ param, text }) {
    const { query, setQuery } = useContext(SearchContext);
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.split(param.text)[1]) {
            const parsed = input.split(text).join(param);
            const q = query;
            setQuery([...q, parsed]);
            setInput("");
        }
    };
    return (
        <form
            className="flex flex-row items-center h-10 p-1 w-full text-white"
            id="parameter"
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex flex-row w-full items-end rounded h-full">
                <div className="rounded-left flex-shrink-0 px-1 text-white h-fit !text-zinc-100 text-lg">
                    {input.split(text)[1] ? (
                        <p className="w-fit">{text + input.split(text)[1]}</p>
                    ) : (
                        <p className="w-fit">{text}</p>
                    )}
                </div>
                {showInput && (
                    <input
                        id=""
                        className={`pl-1 pr-0 outline-none w-full !bg-zinc-900 h-fit text-white parameter-input ${
                            !input.split(param.text)[1] ? "rounded-right" : ""
                        }`}
                        onChange={(e) => setInput(param.text + e.target.value || "")}
                        placeholder={param.example}
                        value={input.split(":")[1] ? input.split(":")[1] : ""}
                    />
                )}
                {/* {input && input.split(param.text)[1] && (
                    <button
                        type="submit"
                        className="rounded-right bg-zinc-300 hover:bg-slate-600 h-full"
                    >
                        <img
                            src={require("../../../assets/images/plus.png")}
                            className="w-fit mr-0 self-end px-1 h-full"
                        />
                    </button>
                )} */}
            </div>
        </form>
    );
}
