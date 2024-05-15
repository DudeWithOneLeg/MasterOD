import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as searchActions from "../../store/search";
import Result from "../Result";

// import './index.css'

export default function Results({
  setPreview,
  showResult,
  setShowResult,
  start,
  setStart,
  params,
  setResult,
  infiniteScroll,
  data
}) {
  // const data = useSelector((state) => state.search.results);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const resultsContainer = window.document.querySelector("#inner-result");
    if (data && resultsContainer && infiniteScroll) {
      const scrollFunction = () => {
        const scrollPosition =
          resultsContainer.scrollTop + resultsContainer.clientHeight;
        const bottomPosition = resultsContainer.scrollHeight;

        // console.log(scrollPosition, bottomPosition);
        if (scrollPosition >= bottomPosition - 1) {
          resultsContainer.removeEventListener("scroll", scrollFunction);
          // console.log("hit");
          setLoading(true);

          // const nextResultsPage = start + 100;
          // console.log(params);
          return dispatch(searchActions.search({ ...params, start }))
            .then(async () => {
              const lastIndex = Number(Object.keys(results).slice(-2, -1)[0]);
              setStart(lastIndex);
              setLoading(false);
              // console.log("yo");
            })
        }
      };
      resultsContainer.addEventListener("scroll", scrollFunction);
    }
  }, [results]);

  useEffect(() => {
    if (infiniteScroll) {

      setResults(data);
    }
  }, [data]);

  return (
    data &&
    Object.values(data).length > 0 && (
      //KEEP CLASS NAME AS IS
      <div
        className={`flex flex-col justify-center h-full overflow-hidden pb-1 ${
          showResult ? "w-full" : "w-100"
        }`}
        id="results"
      >
        <div
          className="rounded flex-col flex h-full py-2 px-2 w-full items-center overflow-y-scroll overflow-x-hidden"
          id="inner-result"
        >
          {Object.keys(data)
            .slice(0, -1)
            .map((rowKey) => {
              return (
                <Result
                  rowKey={rowKey}
                  data={data}
                  showResult={showResult}
                  setShowResult={setShowResult}
                  setPreview={setPreview}
                  setResult={setResult}
                />
              );
            })}
          {loading && (
            <img
              src="/icons/loading.png"
              className="h-26 w-26 rounded-full animate-spin mb-4"
            />
          )}
        </div>
      </div>
    )
  );
}
