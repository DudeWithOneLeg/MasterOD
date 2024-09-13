import { useContext } from "react";
import ResultCard from "./ResultCard";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import { isMobile } from "react-device-detect";

export default function Results({ data }) {
    const { loadingResults } = useContext(SearchContext);
    const { showResult } =
        useContext(ResultsContext);

    return data && Object.values(data).length ? (
        //KEEP CLASS NAME AS IS
        <div
            className={`flex flex-col h-full items-center ${
                isMobile ? "overflow-x-hidden" : ""
            } ${isMobile && !showResult ? "row-span-2" : ""} pb-1 ${
                showResult ? "w-full" : "w-100"
            } bg-zinc-950`}
            id="results"
        >
            <div
                className={`rounded flex-col items-center flex h-full py-2 px-2 w-full overflow-y-scroll overflow-x-hidden`}
                id="inner-result"
            >
                {loadingResults ? (
                    <div className="flex justify-content-center items-center w-full h-full">
                        <img
                            src={require("../../assets/icons/loading.png")}
                            className="h-26 w-26 rounded-full animate-spin mb-4"
                        />
                    </div>
                ) : (
                    <div
                        className={showResult || isMobile ? "w-full" : "w-1/2"}
                    >
                        {Object.values(data)[0] &&
                        Object.values(data)[0].queryId
                            ? Object.keys(data)
                                  .reverse()
                                  .filter((key) => !data[key].currentPage)
                                  .map((rowKey) => {
                                      return (
                                          <ResultCard
                                              rowKey={rowKey}
                                              data={data}
                                          />
                                      );
                                  })
                            : Object.keys(data)
                                  .filter((key) => !data[key].currentPage)
                                  .map((rowKey) => {
                                      return (
                                          <ResultCard
                                              rowKey={rowKey}
                                              data={data}
                                          />
                                      );
                                  })}
                    </div>
                )}
            </div>
        </div>
    ) : loadingResults ? (
        <div className="flex justify-content-center items-center w-full h-full">
            <img
                src={require("../../assets/icons/loading.png")}
                className="h-26 w-26 rounded-full animate-spin mb-4"
            />
        </div>
    ) : (
        <div className="flex justify-content-center align-items-center text-white w-full">
            No results
        </div>
    );
}
