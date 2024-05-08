import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as queryActions from "../../store/query";

export default function QueryStats() {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.queries.all);
  const [viewAll, setViewAll] = useState(true);

  useEffect(() => {
    dispatch(queryActions.getQueries());
  }, [dispatch]);

  return (
    <div className="p-2 w-full">
      <div className="flex items-center justify-content-center w-full p-7">
        <input className="w-full rounded-full h-10 px-3" />
      </div>
      <div className="text-slate-200 px-5">
        <div className="flex flex-row">
          <p
            onClick={() => setViewAll(true)}
            className={`px-1 ${viewAll ? "border-b" : ""}`}
          >
            All
          </p>
          <p
            onClick={() => setViewAll(false)}
            className={`ml-1 px-1 ${viewAll ? "" : "border-b"}`}
          >
            Saved
          </p>
        </div>
        <div className="divide divide-y">
                    <div className="flex flex-row">
                        <p className="w-1/3">Query</p>
                        <p className="w-1/3">Created</p>
                        <p className="w-1/3">Engine</p>
                    </div>
          {queries && Object.values(queries).length ? (
            viewAll ? (
              Object.values(queries).map((query) => {
                return (
                  <div className="flex flex-row divide divide-x justify-content-between w-full p-1">

                    <div className="flex flex-row w-1/3">
                      <img
                        src={`${
                            query.saved
                            ? "/icons/bookmark_FILL.png"
                            : "/icons/bookmark.png"
                        }`}
                        className="h-8"
                      />
                    <p className="w-full flex align-items-center justify-content-center">{query.query}</p>
                    </div>
                    <p className="w-1/3 flex align-items-center justify-content-center">
                      {new Date(query.createdAt).toString()}
                    </p>
                      <div className="w-1/3 flex align-items-center justify-content-center">{query.engine == 'google' ? <img className='h-7 rounded' src='/icons/google.png'/> : <img className='h-7 rounded' src='/icons/bing.jpg'/>}</div>
                  </div>
                );
              })
            ) : (
              Object.values(queries).map((query) => {
                if (query.saved) {
                  return (
                    <div className="flex flex-row divide divide-x justify-content-between w-full p-1">

                    <div className="flex flex-row w-1/3">
                      <img
                        src={`${
                            query.saved
                            ? "/icons/bookmark_FILL.png"
                            : "/icons/bookmark.png"
                        }`}
                        className="h-8"
                      />
                    <p className="w-full flex align-items-center justify-content-center">{query.query}</p>
                    </div>
                    <p className="w-1/3 flex align-items-center justify-content-center">
                      {new Date(query.createdAt).toString()}
                    </p>
                      <div className="w-1/3 flex align-items-center justify-content-center">{query.engine == 'google' ? <img className='h-7 rounded' src='/icons/google.png'/> : <img className='h-7 rounded' src='/icons/bing.jpg'/>}</div>
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
