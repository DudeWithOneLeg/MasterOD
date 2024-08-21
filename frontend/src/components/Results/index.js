import { useState } from "react";
import Result from "../Result";
const loadingImg = require("../../assets/icons/loading.png");

// import './index.css'

export default function Results({
  setPreview,
  showResult,
  setShowResult,
  setResult,
  data,
  filterInput,
  visitedResults,
  setVisitedResults,
  currentSelected,
  setCurrentSelected,
  loadingResults,
}) {
  // const data = useSelector((state) => state.search.results);
  // const data = useSelector((state) => state.results.results);

  const [width, setWidth] = useState("w-1/2");

  // useEffect(() => {

  //   //select element
  //   const resultsContainer = window.document.querySelector("#inner-result");

  //   if (data && resultsContainer && infiniteScroll && status === 'next') {
  //     const scrollFunction = () => {
  //       const scrollPosition = resultsContainer.scrollTop + resultsContainer.clientHeight;
  //       const bottomPosition = resultsContainer.scrollHeight;

  //       // console.log(scrollPosition.toFixed(0), bottomPosition.toFixed(0), scrollPosition.toFixed(0) >= bottomPosition.toFixed(0) - 1)
  //       if (scrollPosition >= bottomPosition - 1) {
  //         // console.log(start)
  //         resultsContainer.removeEventListener("scroll", scrollFunction);
  //         // console.log("hit");
  //         setLoading(true);

  //         return dispatch(resultActions.search({ ...params, start: Number(Object.keys(data).slice(-2, -1)[0]) }, status = 'next'))
  //         .then(async () => {
  //           resultsContainer.scrollTo(0, bottomPosition)
  //           setStatus('next')
  //             const lastIndex = Number(Object.keys(results).slice(-2, -1)[0]);
  //             setStart(lastIndex);
  //             setLoading(false);
  //             // setStatus('next')
  //           })
  //       }
  //     };
  //     // console.log('listener mounted')
  //     return resultsContainer.addEventListener("scroll", scrollFunction);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (infiniteScroll) {

  //     setResults(data);
  //   }
  // }, [data]);

  return data && Object.values(data).length ? (
    //KEEP CLASS NAME AS IS
    <div
      className={`flex flex-col justify-center h-full overflow-hidden pb-1 ${
        showResult ? "w-full" : "w-100"
      }`}
      id="results"
    >
      <div
        className={`rounded flex-col flex h-full py-2 px-2 w-full items-center overflow-y-scroll overflow-x-hidden`}
        id="inner-result"
      >
        {loadingResults ? (
          <div className="flex justify-content-center items-center w-full h-full">
            <img
              src={require('../../assets/icons/loading.png')}
              className="h-26 w-26 rounded-full animate-spin mb-4"
            />
          </div>
        ) : (
          <div className={`${width}`}>
            {Object.values(data)[0] && Object.values(data)[0].queryId
              ? Object.keys(data)
                  .reverse()
                  .filter((key) => !data[key].currentPage)
                  .map((rowKey) => {
                    if (filterInput) {
                      const result = data[rowKey];
                      if (
                        result &&
                        result.title &&
                        (result.title.toLowerCase().includes(filterInput) ||
                          result.snippet.toLowerCase().includes(filterInput) ||
                          result.link.toLowerCase().includes(filterInput))
                      ) {
                        return (
                          <Result
                            rowKey={rowKey}
                            data={data}
                            showResult={showResult}
                            setShowResult={setShowResult}
                            setPreview={setPreview}
                            setResult={setResult}
                            setWidth={setWidth}
                            currentSelected={currentSelected}
                            setCurrentSelected={setCurrentSelected}
                            visitedResults={visitedResults}
                            setVisitedResults={setVisitedResults}
                          />
                        );
                      }
                    } else {
                      return (
                        <Result
                          rowKey={rowKey}
                          data={data}
                          showResult={showResult}
                          setShowResult={setShowResult}
                          setPreview={setPreview}
                          setResult={setResult}
                          setWidth={setWidth}
                          currentSelected={currentSelected}
                          setCurrentSelected={setCurrentSelected}
                          visitedResults={visitedResults}
                          setVisitedResults={setVisitedResults}
                        />
                      );
                    }
                  })
              : Object.keys(data)
                  .filter((key) => !data[key].currentPage)
                  .map((rowKey) => {
                    return (
                      <Result
                        rowKey={rowKey}
                        data={data}
                        showResult={showResult}
                        setShowResult={setShowResult}
                        setPreview={setPreview}
                        setResult={setResult}
                        setWidth={setWidth}
                        currentSelected={currentSelected}
                        setCurrentSelected={setCurrentSelected}
                        visitedResults={visitedResults}
                        setVisitedResults={setVisitedResults}
                      />
                    );
                  })}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-content-center align-items-center text-white w-full">
      No results
    </div>
  );
}
