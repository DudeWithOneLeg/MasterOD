import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as queryActions from "../../store/query";
import { SelectLimit } from "./SelectLimit";
import MobileQueryRow from "./MobileQueryRow";

export default function MobileQueryPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const queries = useSelector((state) => state.queries.all);
    const [viewAll, setViewAll] = useState(true);
    const [filter, setFilter] = useState("");
    const [limit, setLimit] = useState(25);
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
            });
        }
        setSortedQueries(newSortedQueries);
    }, [queries]);

    useEffect(() => {
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll }));
    }, [dispatch, limit]);

    useEffect(() => {
        const { view } = params;
        if (view === "saved") setViewAll(false);
        else if (view === "all") setViewAll(true);
    }, [params, dispatch]);

    useEffect(() => {
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll }));
    }, [viewAll]);

    useEffect(() => {
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll }));
    }, [dispatch, limit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(queryActions.getQueries({ limit, filter, saved: !viewAll }));
    };

    return (
        <div className="flex bg-zinc-900 h-full overflow-hidden w-full">
            <div className="w-full h-full flex flex-col text-slate-200 bg-zinc-900 rounded justify-center items-center">
                <div className="px-2 flex flex-row justify-between items-center w-full bg-slate-600">
                    <h1 className="text-xl !text-white">History</h1>
                    <div className="w-fit flex justify-center items-center h-full">
                        <SelectLimit
                            setViewAll={setViewAll}
                            setLimit={setLimit}
                            limit={limit}
                            viewAll={viewAll}
                        />

                        {/* <form
                            onSubmit={(e) => handleSubmit(e)}
                            className={`flex justify-self-center justify-between rounded w-1/2 my-2 px-2 bg-white`}
                        >
                            <input
                                className="w-1/2 h-[3vh] text-black outline-none"
                                placeholder="Filter searches"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="text-black focus:outline-none"
                            >
                                Search
                            </button>
                        </form> */}
                    </div>
                </div>
                <div className="h-full overflow-y-hidden rounded border-1 border-zinc-600 bg-zinc-900 flex justify-center w-full p-2">
                    <div
                        className={`flex flex-col h-full overflow-y-scroll no-scrollbar items-center w-full space-y-2`}
                    >
                        {queries && Object.keys(queries).length && !queries.message
                            ? Object.values(queries)
                                  .reverse()
                                  .map((query) => {
                                      return <MobileQueryRow query={query} />;
                                  })
                            : <div className="w-full px-4 flex flex-col h-full items-center justify-center text-3xl text-white">
                            <div className="flex flex-row">
                                <h1>View our</h1>
                                <h1 onClick={() => navigate("/guide")} className="ml-2 underline text-blue-600 cursor-pointer"> Guide</h1>
                            </div>

                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
