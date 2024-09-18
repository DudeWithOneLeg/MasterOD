export const SelectLimit = ({setLimit, setViewAll, limit, viewAll}) => {
    return (
        <div className="flex h-full justify-content-start items-center">
            <div className="flex flex-row w-fit rounded text-lg text-zinc-200 h-fit items-end">
                <p
                    onClick={() => setViewAll(true)}
                    className={`px-1 cursor-pointer rounded transition-all duration-300 flex items-end ${
                        viewAll
                            ? "text-2xl"
                            : ""
                    }`}
                >
                    All
                </p>
                <p
                    onClick={() => setViewAll(false)}
                    className={`px-1 cursor-pointer rounded transition-all duration-300 ${
                        viewAll ? "" : "text-2xl"
                    }`}
                >
                    Saved
                </p>
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
