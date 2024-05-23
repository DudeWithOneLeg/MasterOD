import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as queryActions from "../../store/query";

export default function QueryPage() {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.queries.all);
  const [viewAll, setViewAll] = useState(false);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    dispatch(queryActions.getQueries());
  }, [dispatch]);

  return (
    <div className="w-full h-full flex flex-col text-slate-200 bg-slate-700 rounded">
      <div className="px-2">
        <div className="flex items-center justify-content-center w-full my-2">
          <input
            className="w-1/2 rounded-full h-8 px-3 text-black"
            placeholder="Filter searches"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-content-center">
          <div className="flex flex-row w-fit rounded bg-slate-500">
            <p
              onClick={() => setViewAll(true)}
              className={`px-1 cursor-pointer ${viewAll ? "border-b-4" : "hover:bg-slate-600 hover:border-b-4"}`}
            >
              All
            </p>
            <p
              onClick={() => setViewAll(false)}
              className={`ml-1 px-1 cursor-pointer ${
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
                    <div className="flex flex-row divide divide-x justify-content-between w-full p-1 hover:bg-slate-500">
                      <div className="flex flex-row w-1/3">
                        <img
                          src={
                            query.saved
                              ? require("../../assets/icons/bookmark_FILL.png")
                              : require("../../assets/icons/bookmark.png")
                          }
                          className="h-8"
                        />
                        <p className="w-full flex align-items-center justify-content-center">
                          {query.query}
                        </p>
                      </div>
                      <p className="w-1/3 flex align-items-center justify-content-center">
                        {new Date(query.createdAt).toString()}
                      </p>
                      <div className="w-1/3 flex align-items-center justify-content-center">
                        {query.engine == "google" ? (
                          <img
                            className="h-7 rounded"
                            src={require("../../assets/icons/google.png")}
                          />
                        ) : (
                          <img
                            className="h-7 rounded"
                            src={require("../../assets/icons/bing.jpg")}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
                if (filterInput) {
                  if (
                    query.engine
                      .toLowerCase()
                      .includes(filterInput.toLowerCase()) ||
                    query.query
                      .toLowerCase()
                      .includes(filterInput.toLowerCase())
                  ) {
                    return (
                      <div className="flex flex-row divide divide-x justify-content-between w-full p-1 hover:bg-slate-500">
                        <div className="flex flex-row w-1/3">
                          <img
                            src={
                              query.saved
                                ? require("../../assets/icons/bookmark_FILL.png")
                                : require("../../assets/icons/bookmark.png")
                            }
                            className="h-8"
                          />
                          <p className="w-full flex align-items-center justify-content-center">
                            {query.query}
                          </p>
                        </div>
                        <p className="w-1/3 flex align-items-center justify-content-center">
                          {new Date(query.createdAt).toString()}
                        </p>
                        <div className="w-1/3 flex align-items-center justify-content-center">
                          {query.engine == "google" ? (
                            <img
                              className="h-7 rounded"
                              src={require("../../assets/icons/google.png")}
                            />
                          ) : (
                            <img
                              className="h-7 rounded"
                              src={require("../../assets/icons/bing.jpg")}
                            />
                          )}
                        </div>
                      </div>
                    );
                  }
                }
              })
            ) : (
              Object.values(queries).map((query) => {
                if (query.saved) {
                  return (
                    <div className="flex flex-row divide divide-x justify-content-between w-full p-1 hover:bg-slate-500">
                      <div className="flex flex-row w-1/3">
                        <img
                          src={
                            query.saved
                              ? require("../../assets/icons/bookmark_FILL.png")
                              : require("../../assets/icons/bookmark.png")
                          }
                          className="h-8"
                        />
                        <p className="w-full flex align-items-center justify-content-center">
                          {query.query}
                        </p>
                      </div>
                      <p className="w-1/3 flex align-items-center justify-content-center">
                        {new Date(query.createdAt).toString()}
                      </p>
                      <div className="w-1/3 flex align-items-center justify-content-center">
                        {query.engine == "google" ? (
                          <img
                            className="h-7 rounded"
                            src={require("../../assets/icons/google.png")}
                          />
                        ) : (
                          <img
                            className="h-7 rounded"
                            src={require("../../assets/icons/bing.jpg")}
                          />
                        )}
                      </div>
                    </div>
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
