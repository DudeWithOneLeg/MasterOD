import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Results from "../Results";
import Browser from "../Browser";
import * as resultActions from "../../store/result";
import * as searchActions from "../../store/search";

export default function ResultsPage({
    visitedResults,
    setVisitedResults,
    currentSelected,
    setCurrentSelected,
    loadingResults,
    isIndex,
    setIsIndex,
}) {
    const dispatch = useDispatch();
    const params = useParams();
    const saved = useSelector((state) => state.results.saved);
    const visited = useSelector((state) => state.results.visited);
    const data = useSelector((state) => state.search.data);
    const [preview, setPreview] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({});
    const [browseHistory, setBrowseHistory] = useState([]);
    const [filterInput, setFilterInput] = useState("");
    const [viewAll, setViewAll] = useState(true);
    const [limit, setLimit] = useState(25);

    const docExtensions = ["pdf", "ppt", "doc", "docx"];

    useEffect(() => {
        const options = { limit };
        if (filterInput) options.filter = filterInput;
        dispatch(resultActions.getallResults( options ));
    }, [dispatch]);

    useEffect(() => {
        if (
            preview &&
            !docExtensions.includes(preview.split(".").slice(-1)[0])
        ) {
            dispatch(searchActions.fetchResult(result));
            if (!browseHistory.length) {
                setBrowseHistory([preview]);
            }
        }
    }, [preview, dispatch]);

    useEffect(() => {
        const { view } = params;
        // console.log(params)
        if (view === "saved") setViewAll(false);
        else if (view === "all") setViewAll(true);
        else setViewAll(true);
    }, [params]);

    const handleSubmit = (e) => {
      e.preventDefault()
      const options = { limit };
      if (filterInput) options.filter = filterInput;
      dispatch(resultActions.getallResults( options ));
    }

    return (
        <div
            className={`flex flex-col  w-full ${
                isMobile ? "h-full" : "h-full"
            }`}
        >
            <div
                className={`flex items-center justify-content-center my-2 ${
                    preview && !isMobile ? "w-1/2" : ""
                }`}
            >
                <form
                    className={`flex justify-center items-center text-white ${
                        preview && !isMobile ? "w-1/2 flex-row" : (!preview && !isMobile ? "w-1/3 flex-row" : "w-2/3 flex-col")
                    }`}
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className=" flex w-full rounded h-8 text-black bg-white">

                      <input
                          className="w-full h-full rounded focus:outline-none px-2"
                          placeholder="Filter results"
                          value={filterInput}
                          onChange={(e) =>
                              setFilterInput(e.target.value.toLowerCase())
                          }
                      />
                      <button type='submit' className="focus:outline-none px-2">Search</button>
                    </div>
                    <div className="flex flex-row px-2 items-center">
                        <div className="flex flex-row w-fit rounded bg-slate-500">
                            <p
                                onClick={() => setViewAll(true)}
                                className={`px-1 cursor-pointer rounded ${
                                    viewAll
                                        ? "border-b-4"
                                        : "hover:bg-slate-600 hover:border-b-4 hover:border-gray-400"
                                }`}
                            >
                                All
                            </p>
                            <p
                                onClick={() => setViewAll(false)}
                                className={`px-1 cursor-pointer rounded ${
                                    viewAll
                                        ? "hover:bg-slate-600 hover:border-b-4"
                                        : "border-b-4"
                                }`}
                            >
                                Saved
                            </p>
                        </div>
                        <div>
                            <select
                                className="mx-2 text-slate-600 cursor-pointer rounded"
                                onChange={(e) =>
                                    setLimit(Number(e.target.value))
                                }
                                value={limit}
                            >
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div
                className={`flex w-full h-full pt-2 overflow-y-hidden ${
                    isMobile ? "grid grid-rows-2 gap-1 flex-col" : ""
                }`}
            >
                {saved && !viewAll ? (
                    <>
                        <Results
                            setPreview={setPreview}
                            preview={preview}
                            showResult={showResult}
                            setShowResult={setShowResult}
                            setResult={setResult}
                            infiniteScroll={false}
                            data={saved}
                            currentSelected={currentSelected}
                            setCurrentSelected={setCurrentSelected}
                            visitedResults={visitedResults}
                            setVisitedResults={setVisitedResults}
                            loadingResults={loadingResults}
                            setIsIndex={setIsIndex}
                        />
                    </>
                ) : (
                    <></>
                )}
                {visited && viewAll ? (
                    <>
                        <Results
                            setPreview={setPreview}
                            preview={preview}
                            showResult={showResult}
                            setShowResult={setShowResult}
                            setResult={setResult}
                            infiniteScroll={false}
                            data={visited}
                            currentSelected={currentSelected}
                            setCurrentSelected={setCurrentSelected}
                            visitedResults={visitedResults}
                            setVisitedResults={setVisitedResults}
                            loadingResults={loadingResults}
                            setIsIndex={setIsIndex}
                        />
                    </>
                ) : (
                    <></>
                )}
                {(showResult && data) || (showResult && preview) ? (
                    <Browser
                        preview={preview}
                        data={data}
                        setPreview={setPreview}
                        isIndex={isIndex}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
