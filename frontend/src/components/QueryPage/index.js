import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
    const params = useParams();
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

        if (queries) {
            sortByDay(queries);
        }

    }, [queries]);


    useEffect(() => {
        const { view } = params;
        setViewAll(view === "all");
    }, [params]);

    useEffect(() => {
        const options = { limit, filter, saved: !viewAll }
        if (engineFilter !== 'all' && engineFilter !== '') options.engine = engineFilter
        // console.log(options)
        dispatch(queryActions.getQueries(options));
    }, [dispatch, limit, viewAll, engineFilter]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll, engine: engineFilter }));
    };

    if (isMobile) return (<MobileQueryPage />)
    else return (
        <div className="flex h-full overflow-hidden w-full">
            <div className="h-full w-full overflow-y-hidden rounded border-1 border-zinc-600 flex justify-center">
                <div className={`${isMobile ? "flex flex-col" : "flex flex-col"} h-full w-full overflow-y-scroll no-scrollbar items-center p-1`}>
                    <div className="flex flex-row justify-start items-center w-4/5">
                        <h1 className="text-4xl !text-white">History</h1>
                        <div className="w-fit flex justify-center items-center">
                            <SelectLimit setViewAll={setViewAll} setLimit={setLimit} limit={limit} viewAll={viewAll} />
                            <SelectEngine engineFilter={engineFilter} setEngineFilter={setEngineFilter} />
                            <form
                                onSubmit={(e) => handleSubmit(e)}
                                className={`rounded-full px-2 py-1 flex justify-self-center justify-between w-1/2 my-2 bg-white/5 backdrop-blur-xl`}
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
                                    <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="search"/>
                                </button>
                            </form>
                        </div>
                    </div>
                    {sortedQueries && Object.keys(sortedQueries).length
                        ? Object.keys(sortedQueries)
                            .reverse()
                            .map((date) => {
                                return (
                                    <div className="flex flex-col text-white py-2 h-fit w-4/5" key={date}>
                                        <h1 className="text-2xl w-full border-b-4 border-amber-900">
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
                        : <></>}
                </div>
            </div>
        </div>
    );
}