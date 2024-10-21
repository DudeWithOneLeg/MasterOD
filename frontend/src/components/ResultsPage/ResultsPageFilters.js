import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as resultActions from '../../store/result'
import searchIcon from "../../assets/images/search.png";

export default function ResultsPageFilters({setIsLoading}) {
    const params = useParams()
    const { view } = params;
    const isViewAll = (view === 'saved' ? false : (view === 'all'))
    const dispatch = useDispatch()
    const [filterInput, setFilterInput] = useState("");
    const [viewAll, setViewAll] = useState(isViewAll);
    const [limit, setLimit] = useState(25);

    useEffect(() => {
        const options = { limit, saved: !isViewAll };
        if (filterInput) options.filter = filterInput;
        setIsLoading(true)
        dispatch(resultActions.getallResults(options))
        .then(async () => setIsLoading(false))
    }, [dispatch, limit, view]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { limit, saved: !viewAll };
        if (filterInput) options.filter = filterInput;
        setIsLoading(true)
        dispatch(resultActions.getallResults(options))
        .then(async () => setIsLoading(false))
    };

    return (
        <form
            className={`flex justify-center items-center text-white w-full`}
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex flex-row p-2 items-center space-x-2 w-full">
                <div
                    className={`rounded-full px-2 py-1 flex justify-between w-full my-2 bg-white/5 backdrop-blur-xl`}
                >
                    <input
                        className="px-1 bg-white/0 rounded w-full outline-none h-full text-white poppins-light text-lg"
                        placeholder="Filter Resources"
                        value={filterInput}
                        onChange={(e) =>
                            setFilterInput(e.target.value.toLowerCase())
                        }
                    />
                    <button
                        type="submit"
                        className="text-black focus:outline-none cursor-pointer rounded-full h-7 w-7"
                    >
                        <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="search" />
                    </button>
                </div>
                <div className="flex flex-row w-fit rounded">
                    <p
                        onClick={() => setViewAll(true)}
                        className={`px-1 cursor-pointer rounded ${viewAll
                            ? "border-b-4"
                            : "hover:bg-slate-600 hover:border-b-4 hover:border-gray-400"
                            }`}
                    >
                        All
                    </p>
                    <p
                        onClick={() => setViewAll(false)}
                        className={`px-1 cursor-pointer rounded ${viewAll
                            ? "hover:bg-slate-600 hover:border-b-4"
                            : "border-b-4"
                            }`}
                    >
                        Saved
                    </p>
                </div>
                <div>
                    <select
                        className="mx-2 text-slate-600 cursor-pointer rounded"
                        onChange={(e) =>
                            setLimit(Number(e.target.value))
                        }
                        value={limit}
                    >
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
            </div>
        </form>
    )
}
