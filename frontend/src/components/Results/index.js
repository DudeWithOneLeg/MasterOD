import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as searchActions from "../../store/search";
import * as resultActions from "../../store/result";
import Result from "../Result";
const loadingImg = require('../../assets/icons/loading.png')

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
  data,
  status,
  setStatus,
  filterInput
}) {
  // const data = useSelector((state) => state.search.results);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(null);
  // const data = useSelector((state) => state.results.results);

  const [width, setWidth] = useState('w-1/2')

  const dispatch = useDispatch();

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

  return (
    data &&
    Object.values(data).length ? (
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
          <div className={`${width}`}>

          {Object.values(data)[0] && Object.values(data)[0].queryId ? Object.keys(data).reverse()
          .filter(key => !data[key].currentPage)
            .map((rowKey) => {
              if (filterInput) {
                const result = data[rowKey]
                if ((result && result.title) && (result.title.toLowerCase().includes(filterInput) || result.snippet.toLowerCase().includes(filterInput) || result.link.toLowerCase().includes(filterInput))) {
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
                    />
                  );
                }
              }
              else {

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
                  />
                );
              }
            }) : Object.keys(data)
          .filter(key => !data[key].currentPage)
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
                />
              );
            })}
          </div>
          {loading && (
            <img
              src={loadingImg}
              className="h-26 w-26 rounded-full animate-spin mb-4"
            />
          )}
        </div>
      </div>
    ) : <></>
  );
}
