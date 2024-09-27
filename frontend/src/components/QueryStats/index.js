import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import QueryRow from "./QueryRow";
import * as queryActions from "../../store/query";
import { SelectLimit } from "./SelectLimit";
import { SelectEngine } from "./SelectEngine";
import MobileQueryRow from "./MobileQueryRow";
import MobileQueryPage from "./MobileQueryPage";

export default function QueryPage() {
    const dispatch = useDispatch();
    const queries = useSelector((state) => state.queries.all);
    const [viewAll, setViewAll] = useState(true);
    const [filter, setFilter] = useState("");
    const [limit, setLimit] = useState(25);
    const [engineFilter, setEngineFilter] = useState("");
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
        if (queries) {
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
            });
        }
        setSortedQueries(newSortedQueries);
    }, [queries]);


    useEffect(() => {
        const { view } = params;
        if (view === "saved") setViewAll(false);
        else if (view === "all") setViewAll(true);
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
            {/* ... existing code ... */}
            <div className="h-full w-full overflow-y-hidden rounded border-1 border-zinc-600 flex justify-center">
                <div className={`${isMobile ? "flex flex-col" : "flex flex-col"} h-full w-full overflow-y-scroll no-scrollbar items-center p-1`}>
                    {queries && Object.values(queries).length && isMobile
                        ? Object.values(queries)
                            .reverse()
                            .map((query) => {
                                return <MobileQueryRow query={query} key={query.id} />;
                            })
                        : Object.keys(sortedQueries)
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
                            })}
                </div>
            </div>
        </div>
    );
}
