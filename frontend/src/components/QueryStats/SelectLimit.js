import { useNavigate } from "react-router-dom";

export const SelectLimit = ({setLimit, setViewAll, limit, viewAll}) => {
    const navigate = useNavigate()
    return (
        <div className="flex h-full justify-content-start items-center">
            <div className="flex flex-row w-fit rounded text-lg text-zinc-200 h-fit items-end">
                <button
                    onClick={() => navigate('/search/all')}
                    className={`px-1 cursor-pointer rounded transition-all duration-300 flex items-end focus:outline-none ${
                        viewAll
                            ? "text-2xl"
                            : ""
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => navigate('/search/saved')}
                    className={`px-1 cursor-pointer rounded transition-all duration-300 focus:outline-none ${
                        viewAll ? "" : "text-2xl"
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
