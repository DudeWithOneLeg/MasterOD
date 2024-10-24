import { useContext } from "react";
import ResultCard from "./ResultCard";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import { isMobile } from "react-device-detect";

export default function Results({ data, selectResources }) {
    const { loadingResults } = useContext(SearchContext);
    const { showResult } = useContext(ResultsContext);
    const isSearch = window.location.pathname.includes('results')
    const isViewAll = !window.location.pathname.includes('saved')

    return data && Object.values(data).length ? (
        <div className={`flex flex-col h-full items-center ${isMobile ? "overflow-x-hidden" : "overflow-y-auto"} ${isMobile && !showResult ? "row-span-2" : ""} pb-1 ${showResult ? "w-full" : "w-100"}`} id="results">
            {loadingResults ? (
                <div className="flex justify-center items-center w-full h-full">
                    <img src={require("../../assets/icons/loading.png")} className="h-26 w-26 rounded-full animate-spin mb-4" alt="loading" />
                </div>
            ) : (
                <div className={`${showResult || isMobile ? "w-full" : "3xl:w-1/2 2xl:w-1/2 xl:w-full lg:w-full md:w-full"} p-2`}>
                    {Object.values(data)[0]?.queryId
                        ? Object.keys(data)
                            .reverse()
                            .filter((key) => !data[key].currentPage)
                            .map((rowKey, index) => (
                                <ResultCard key={rowKey} rowKey={rowKey} data={data} index={index} selectResources={selectResources} />
                            ))
                        : Object.keys(data)
                            .filter((key) => !data[key].currentPage)
                            .map((rowKey, index) => (
                                <ResultCard key={rowKey} rowKey={rowKey} data={data} index={index} selectResources={selectResources} />
                            ))}
                </div>
            )}
        </div>
    ) : loadingResults ? (
        <div className="flex justify-center items-center w-full h-full">
            <img src={require("../../assets/icons/loading.png")} className="h-26 w-26 rounded-full animate-spin mb-4" alt="loading" />
        </div>
    ) : (
        isSearch ? (isViewAll ? (<div className="flex justify-center items-center text-white w-full text-xl">
            Saved and viewed resources will show up here
        </div>) : <div className="flex justify-center items-center text-white w-full text-xl" >
            Saved resources will show up here
        </div>) :
            (<div className="flex justify-center items-center text-white w-full text-xl">
                No results
            </div>)
    );
}
