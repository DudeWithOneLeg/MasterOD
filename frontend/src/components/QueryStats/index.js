import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import QueryRow from "./QueryRow";
import * as queryActions from "../../store/query";

export default function QueryPage({ setQuery, setString}) {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.queries.all);
  const [viewAll, setViewAll] = useState(true);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(25);
  const params = useParams()


  useEffect(() => {
    dispatch(queryActions.getQueries({limit, filter, saved: !viewAll}));
  },[dispatch, limit])

  useEffect(() => {
    const {view} = params
    if (view === 'saved') setViewAll(false)
      else if (view === 'all') setViewAll(true)

  },[params, dispatch])

  useEffect(() => {

    dispatch(queryActions.getQueries({limit, filter, saved: !viewAll}))
  },[viewAll])

  useEffect(() => {
    dispatch(queryActions.getQueries({limit, filter, saved: !viewAll}));
  }, [dispatch, limit]);

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(queryActions.getQueries({limit, filter, saved: !viewAll}));
  }

  return (
    <div className="flex bg-slate-900 pt-2 h-full w-full overflow-hidden">

      <div className="w-full h-full flex flex-col text-slate-200 bg-slate-700 rounded">
        <div className="px-2 flex flex-col">
          <form onSubmit={(e) => handleSubmit(e)} className={`flex self-center justify-self-center justify-content-between rounded ${isMobile ? '1/2' : 'w-1/3'} my-2 px-2 bg-white`}>
            <input
              className="w-full h-[3vh] text-black outline-none"
              placeholder="Filter searches"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button type='submit' className="text-black focus:outline-none">Search</button>
          </form>
          <div className="flex w-full justify-content-center">
            <div className="flex flex-row w-fit rounded bg-slate-500">
              <p
                onClick={() => setViewAll(true)}
                className={`px-1 cursor-pointer rounded ${viewAll ? "border-b-4" : "hover:bg-slate-600 hover:border-b-4 hover:border-gray-400"}`}
              >
                All
              </p>
              <p
                onClick={() => setViewAll(false)}
                className={`px-1 cursor-pointer rounded ${
                  viewAll ? "hover:bg-slate-600 hover:border-b-4" : "border-b-4"
                }`}
              >
                Saved
              </p>
            </div>
              <select className="mx-2 text-slate-600 cursor-pointer rounded" onChange={(e) => setLimit(Number(e.target.value))} value={limit}>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
          </div>
        </div>
        <div className="flex flex-row grid grid-cols-9  justify-content-between py-2 px-1 w-full">
          <p className={`col-span-6 text-${isMobile ? 'sm' : 'lg'} text-center`}>Query</p>
          <p className={`col-span-2 text-${isMobile ? 'sm' : 'lg'} text-center`}>Date</p>
          <p className={`col-span-1 text-${isMobile ? 'sm' : 'lg'} text-center`}>Engine</p>
        </div>
        <div className="h-full overflow-y-hidden rounded border-2 border-slate-600 bg-slate-800">
          <div className="flex flex-col divide divide-y h-full overflow-y-scroll">
            {queries && Object.values(queries).length ? (
              viewAll ? (
                Object.values(queries)
                  .reverse()
                  .map((query) => {
                    return (
                      <QueryRow query={query} setString={setString} setQuery={setQuery}/>
                    );
                })
              ) : (
                Object.values(queries)
                .reverse()
                  .map((query) => {
                  if (query.saved) {
                    return (
                      <QueryRow query={query} setString={setString} setQuery={setQuery}/>
                    );
                  }
                  return
                })
              )
            ) : (
              <></>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
