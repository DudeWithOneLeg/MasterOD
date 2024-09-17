export const SelectLimit = ({setLimit, setViewAll, limit, viewAll}) => {
    return (
        <div className="flex w-full h-fit justify-content-start items-end">
            <div className="flex flex-row w-fit rounded text-xl text-zinc-500">
                <p
                    onClick={() => setViewAll(true)}
                    className={`px-1 cursor-pointer rounded ${
                        viewAll
                            ? "border-b-4"
                            : "hover:border-b-4 hover:border-gray-400"
                    }`}
                >
                    All
                </p>
                <p
                    onClick={() => setViewAll(false)}
                    className={`px-1 cursor-pointer rounded ${
                        viewAll ? "hover:border-b-4" : "border-b-4"
                    }`}
                >
                    Saved
                </p>
            </div>
            <select
                className="mx-2 text-slate-600 cursor-pointer rounded"
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
