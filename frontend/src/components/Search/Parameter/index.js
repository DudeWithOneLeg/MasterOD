import { useState, useContext } from "react";
import { SearchContext } from "../../../context/SearchContext";

export default function Parameter({ index ,param, text, selectedOperator, setSelectedOperator }) {
    const { query, setQuery } = useContext(SearchContext);
    const [input, setInput] = useState("");

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
            className={`flex flex-row items-center h-10 p-1 w-full min-w-fit text-white rounded cursor-pointer ${selectedOperator === index ? "bg-zinc-700 shadow-lg" : "hover:bg-zinc-700 hover:shadow-lg"}`}
            id="parameter"
            onSubmit={(e) => handleSubmit(e)}
            onClick={() => setSelectedOperator(index)}
        >
            <div className="flex flex-row w-full items-center rounded h-full">
                <div className="rounded-left flex-shrink-0 px-1 text-white h-fit !text-zinc-100 text-lg">
                    {input.split(text)[1] ? (
                        <p className="w-fit">{text + input.split(text)[1]}</p>
                    ) : (
                        <p className="w-fit">{text}</p>
                    )}
                </div>
                <div className="flex flex-row w-full items-center rounded h-full !bg-zinc-900">

                    <input
                        id=""
                        className={`pl-1 pr-0 outline-none w-full !bg-zinc-900 h-full text-white parameter-input min-w-fit ${
                            !input.split(param.text)[1] ? "rounded-right" : ""
                        }`}
                        onChange={(e) => setInput(param.text + e.target.value || "")}
                        placeholder={param.example}
                        value={input.split(":")[1] ? input.split(":")[1] : ""}
                    />

                {input && input.split(param.text)[1] && (
                    <button
                        type="submit"
                        className="rounded-right hover:bg-amber-800 h-full w-10"
                    >
                        <img
                            src={require("../../../assets/images/plus-white.png")}
                            className="w-full mr-0 self-end h-full"
                        />
                    </button>
                )}
                </div>

            </div>
        </form>
    );
}
