import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as queryActions from "../../store/query";

export default function QueryStats() {
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.queries.all);

  useEffect(() => {
    dispatch(queryActions.getQueries());
  }, [dispatch]);

  return (
    <div className="p-2 w-full">
      <div className="flex items-center justify-content-center w-full p-7">
        <input className="w-full rounded-full h-10 px-3" />
      </div>
      <div className="text-slate-200">
        {queries && Object.values(queries).length ? (
          Object.values(queries).map((query) => {
            return (
              <div>
                {query.engine}
                {query.query}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
