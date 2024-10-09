import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import QueryRow from "./QueryRow";
import * as queryActions from "../../store/query";
import { SelectLimit } from "./SelectLimit";
import { SelectEngine } from "./SelectEngine";
import MobileQueryPage from "./MobileQueryPage";
const searchIcon = require("../../assets/images/search.png");

export default function QueryPage() {
    const dispatch = useDispatch();
    const queries = useSelector((state) => state.queries.all);
    const [viewAll, setViewAll] = useState(true);
    const [filter, setFilter] = useState("");
    const [limit, setLimit] = useState(25);
    const [engineFilter, setEngineFilter] = useState("");
    const [sortedQueries, setSortedQueries] = useState({});
    const [error, setError] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    const sortByDay = (queries) => {
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
        Object.values(queries).forEach((query) => {
            const createdAt = new Date(query.createdAt);
            const dayOfWeek = days[createdAt.getDay()].slice(0, 3);
            const dayOfMonth = createdAt.getDate();
            if (!newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`]) {
                return newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`] = [query];
            } else {
                return newSortedQueries[`${dayOfWeek} - ${dayOfMonth}`].push(query);
            }

        });
        setSortedQueries(newSortedQueries);
        return
    }

    useEffect(() => {

        if (queries && !error && !queries.message) {
            sortByDay(queries);
        }

    }, [queries]);


    useEffect(() => {
        const { view } = params;
        setViewAll(view === "all" || view === undefined);
    }, [params]);

    useEffect(() => {
        const options = { limit, filter, saved: !viewAll }
        if (engineFilter !== 'all' && engineFilter !== '') options.engine = engineFilter
        // console.log(options)
        dispatch(queryActions.getQueries(options));
    }, [dispatch, limit, viewAll, engineFilter]);

    useEffect(() => {
        setError("")
        setSortedQueries({})
    }, [viewAll])

    const handleSubmit = (e) => {
        e.preventDefault();
        setSortedQueries({})
        setError("")
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll, engine: engineFilter })).then(async (data) => {
            if (data.message) {
                setError(data.message)
            }
        })
    };

    if (isMobile) return (<MobileQueryPage />)
    else return (
        <div className="flex h-full overflow-hidden w-full pt-4">
            <div className="h-full w-full overflow-y-hidden rounded border-1 border-zinc-600 flex justify-center">
                <div className={`${isMobile ? "flex flex-col" : "flex flex-col"} h-full w-4/5 no-scrollbar items-center p-1`}>
                    <div className="flex flex-row justify-start items-center w-full border-b-2 border-zinc-600">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-row justify-center items-center">

                                <h1 className="text-4xl !text-blue-300 pr-2 mr-2 border-r-2 border-zinc-600">History</h1>
                                <SelectLimit setViewAll={setViewAll} setLimit={setLimit} limit={limit} viewAll={viewAll} />
                                <SelectEngine engineFilter={engineFilter} setEngineFilter={setEngineFilter} />
                            </div>
                            <div className="flex flex-row justify-center items-center w-1/4">

                                <form
                                    onSubmit={(e) => handleSubmit(e)}
                                    className={`rounded-full px-2 py-1 flex justify-self-center justify-between w-full my-2 bg-white/5 backdrop-blur-xl`}
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
                                        <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="search" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={`w-full px-4 flex flex-col ${error.length ? "h-full items-center justify-center" : ""} overflow-y-auto`}>

                        {sortedQueries && Object.keys(sortedQueries).length
                            ? Object.keys(sortedQueries)
                                .reverse()
                                .map((date) => {
                                    return (
                                        <div className="flex flex-col text-white py-2 h-fit w-full" key={date}>
                                            <h1 className="text-2xl w-full border-b-4 border-blue-400">
                                                {date}
                                            </h1>

                                            <div className="flex flex-row h-fit flex-wrap pl-2 pt-2">
                                                {Object.values(sortedQueries[date])
                                                    .reverse()
                                                    .map((query) => {
                                                        return (
                                                            <QueryRow
                                                                query={query}
                                                                key={query.id}
                                                            />
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    );
                                })
                            : (error.length ? <h1 className="text-2xl text-amber-500">No results found</h1> : <></>)}
                    </div>

                    {!sortedQueries || !Object.keys(sortedQueries).length && !error
                        ? <div className="w-full px-4 flex flex-col h-full items-center justify-center text-3xl text-white">
                            <div className="flex flex-row">
                                <h1>View our</h1>
                                <h1 onClick={() => navigate("/guide")} className="ml-2 underline text-amber-600 cursor-pointer"> Guide</h1>
                            </div>

                        </div>
                        : <></>}
                </div>
            </div>
        </div>
    );
}
