import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import QueryRow from "./QueryRow";
import * as queryActions from "../../store/query";
import * as searchActions from '../../store/search'

export default function QueryPage({ setQuery, setKeywords}) {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.queries.all);
  const [viewAll, setViewAll] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const params = useParams()

  useEffect(() => {
    dispatch(queryActions.getQueries());
  }, [dispatch]);

  useEffect(() => {
    const {view} = params
    if (view === 'saved') setViewAll(false)
    else if (view === 'all') setViewAll(true)
  },[params])

  return (
    <div className="w-full h-full flex flex-col text-slate-200 bg-slate-700 rounded">
      <div className="px-2">
        <div className="flex items-center justify-content-center w-full my-2">
          <input
            className="w-1/2 rounded-full h-8 px-3 text-black"
            placeholder="Filter searches"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value.toLowerCase())}
          />
        </div>
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
        </div>
      </div>
      <div className="flex flex-row px-2">
        <p className="w-1/3">Query</p>
        <p className="w-1/3">Date</p>
        <p className="w-1/3">Engine</p>
      </div>
      <div className=" h-full overflow-hidden rounded border-2 border-slate-600 bg-slate-800">
        <div className="flex flex-col divide divide-y h-full overflow-y-scroll">
          {queries && Object.values(queries).length ? (
            viewAll ? (
              Object.values(queries).map((query) => {
                if (!filterInput) {
                  return (
                    <QueryRow query={query} setKeywords={setKeywords} setQuery={setQuery}/>
                  );
                }
                if (filterInput) {
                  if (
                    query.engine
                      .toLowerCase()
                      .includes(filterInput) ||
                    query.query
                      .toLowerCase()
                      .includes(filterInput)
                  ) {
                    return (
                      <QueryRow query={query} setKeywords={setKeywords} setQuery={setQuery}/>
                    );
                  }
                }
              })
            ) : (
              Object.values(queries).map((query) => {
                if (query.saved) {
                  return (
                    <QueryRow query={query} setKeywords={setKeywords} setQuery={setQuery}/>
                  );
                }
              })
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
