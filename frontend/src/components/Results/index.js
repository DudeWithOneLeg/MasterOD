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
}) {
  const resultState = useSelector((state) => state.search.results);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const resultsContainer = window.document.querySelector("#inner-result");
    if (resultState && resultsContainer) {
      const scrollFunction = () => {
        const scrollPosition =
          resultsContainer.scrollTop + resultsContainer.clientHeight;
        const bottomPosition = resultsContainer.scrollHeight;

        console.log(scrollPosition, bottomPosition);
        if (scrollPosition >= bottomPosition - 1) {
          resultsContainer.removeEventListener("scroll", scrollFunction);
          console.log("hit");
          setLoading(true);

          // const nextResultsPage = start + 100;
          console.log(params);
          return dispatch(searchActions.search({ ...params, start }))
            .then(async () => {
              const lastIndex = Number(Object.keys(results).slice(-2, -1)[0]);
              setStart(lastIndex);
              setLoading(false);
              console.log("yo");
            })
            .then(async () => {
              // resultsContainer.addEventListener("scroll", scrollFunction);
            });
        }
      };
      resultsContainer.addEventListener("scroll", scrollFunction);
    }
  }, [results]);

  useEffect(() => {
    setResults(resultState);
  }, [resultState]);

  return (
    results &&
    Object.values(results).length > 0 && (
      //KEEP CLASS NAME AS IS
      <div
        className={`flex flex-col justify-center h-full overflow-hidden px-2 pb-1 ${
          showResult ? "w-full" : "w-100"
        }`}
        id="results"
      >
        <div
          className="rounded flex-col flex h-full py-2 w-full items-center overflow-y-scroll overflow-x-hidden"
          id="inner-result"
        >
          {Object.keys(results)
            .slice(0, -1)
            .map((rowKey) => {
              return (
                <Result
                  rowKey={rowKey}
                  data={resultState}
                  showResult={showResult}
                  setShowResult={setShowResult}
                  setPreview={setPreview}
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
