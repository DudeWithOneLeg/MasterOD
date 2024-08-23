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
  setIsIndex
}) {

  const [width, setWidth] = useState("w-1/2");

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
                            setIsIndex={setIsIndex}
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
                          setIsIndex={setIsIndex}
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
                        setIsIndex={setIsIndex}
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
