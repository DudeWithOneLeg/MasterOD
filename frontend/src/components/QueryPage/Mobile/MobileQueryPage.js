import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getQueries } from "../../../store/query";
import SelectLimit from "../SelectLimit";
import SelectEngine from "../SelectEngine";
import MobileQueryRow from "./MobileQueryRow";
import searchIcon from "../../../assets/images/search.png"

export default function MobileQueryPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const queries = useSelector((state) => state.queries.all);
    const [viewAll, setViewAll] = useState(true);
    const [filter, setFilter] = useState("");
    const [limit, setLimit] = useState(25);
    const [engineFilter, setEngineFilter] = useState("");
    const [error, setError] = useState("");
    const [sortedQueries, setSortedQueries] = useState({});
    const params = useParams();

    useEffect(() => {
        const newSortedQueries = {};
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        if (queries && Object.keys(queries).length && !queries.message) {
            Object.values(queries).map((query) => {
                const createdAt = new Date(query.createdAt);
                const dayOfWeek = days[createdAt.getDay()].slice(0, 3);
                const dayOfMonth = createdAt.getDate();
                if (!newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`]) {
                    newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`] = [query];
                } else
                    newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`].push(
                        query
                    );
                    return null
            });
        }
        setSortedQueries(newSortedQueries);
    }, [queries]);

    useEffect(() => {
        const { view } = params;
        if (view === "saved") setViewAll(false);
        else if (view === "all") setViewAll(true);
    }, [params, dispatch]);

    useEffect(() => {
        setError("")
        dispatch(getQueries({ limit, filter, saved: !viewAll, engine: engineFilter })).then(async (data) => {
            if (data.message) {
                setError(data.message)
            }
        })
    }, [viewAll, limit, engineFilter]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        dispatch(getQueries({ limit, filter, saved: !viewAll, engine: engineFilter })).then(async (data) => {
            if (data.message) {
                setError(data.message)
            }
        })
    };

    return (
        <div className="flex bg-zinc-900 h-full overflow-hidden w-full">
            <div className="w-full h-full flex flex-col text-slate-200 bg-zinc-900 rounded justify-center items-center space-y-2">
                <div className="flex flex-row items-center w-full space-x-2 px-3">
                    <h1 className="text-2xl border-r pr-2 text-blue-300">History</h1>
                    <SelectLimit
                        setViewAll={setViewAll}
                        setLimit={setLimit}
                        limit={limit}
                        viewAll={viewAll}
                    />
                    <SelectEngine engineFilter={engineFilter} setEngineFilter={setEngineFilter} />
                </div>
                <div className="w-full px-3">

                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className={`rounded-full px-2 py-1 flex justify-self-center justify-between w-full bg-white/5 backdrop-blur-xl`}
                    >
                        <input
                            className="px-1 bg-white/0 rounded w-full outline-none h-full text-white poppins-light text-lg"
                            placeholder="Filter searches"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-black focus:outline-none cursor-pointer rounded-full h-7 w-7"
                        >
                            <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="Search queries." />
                        </button>
                    </form>
                </div>
                <div className="h-full w-full overflow-y-hidden rounded border-1 border-zinc-600 bg-zinc-900 flex justify-center p-2">
                    <div
                        className={`flex flex-col h-full w-full overflow-y-scroll no-scrollbar items-center space-y-2 ${error.length ? 'justify-center' : ''}`}
                    >
                        {(queries && Object.keys(queries).length && !queries.message)
                            ? Object.values(queries)
                                .reverse()
                                .map((query) => {
                                    return <MobileQueryRow query={query} />;
                                })
                            : (error.length ? <h1 className="text-2xl text-amber-500">No results found</h1> : <></>)}

                        {((!queries || !Object.keys(queries).length) && !error)
                            ? <div className="w-full h-full px-4 flex flex-col items-center justify-center text-3xl text-white">
                                <div className="flex flex-row">
                                    <h1>View our</h1>
                                    <h1 onClick={() => navigate("/guide")} className="ml-2 underline text-blue-600 cursor-pointer"> Guide</h1>
                                </div>

                            </div>
                            : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}
