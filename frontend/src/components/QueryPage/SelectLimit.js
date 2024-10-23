import { useNavigate } from "react-router-dom";

export const SelectLimit = ({setLimit, limit, viewAll}) => {
    const navigate = useNavigate()
    return (
        <div className="flex h-full justify-content-start items-center">
            <div className="flex flex-row w-fit rounded text-lg text-zinc-200 h-fit items-end mr-1">
                <button
                    onClick={() => navigate('/search/all')}
                    className={`px-1 mr-1 text-2xl cursor-pointer flex items-center justify-center focus:outline-none ${
                        viewAll
                            ? "border-b-2 border-white-600"
                            : ""
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => navigate('/search/saved')}
                    className={`px-1 text-2xl cursor-pointer focus:outline-none ${
                        viewAll ? "" : "border-b-2 border-white-600"
                    }`}
                >
                    Saved
                </button>
            </div>
            <select
                className="mx-2 text-slate-600 cursor-pointer rounded focus:outline-none"
                onChange={(e) => setLimit(Number(e.target.value))}
                value={limit}
            >
                <option>25</option>
                <option>50</option>
                <option>100</option>
            </select>
        </div>
    );
};
