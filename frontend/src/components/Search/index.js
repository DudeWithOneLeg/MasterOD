import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as searchActions from "../../store/search";
import * as resultActions from "../../store/result";
import { isMobile } from "react-device-detect";
import Results from "../Results";
import Browser from "../Browser";
import SearchBar from "./SearchBar";
import QueryStats from "../QueryStats";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import arrowBack from "../../assets/images/arrow-back.png";

export default function Search() {
    const {
        search,
        setSearch,
        query,
        string,
        setVisitedResults,
        setCurrentSelected,
        loadingResults,
        setLoadingResults,
        isIndex,
        isRedditShared,
        setIsRedditShared,
        isOnReddit,
        setIsOnReddit,
        loading,
        setLoading,
        language,
        country,
        engine,
    } = useContext(SearchContext);
    const {
        preview,
        showResult,
        pageNum,
        setPageNum,
        totalPages,
        setTotalPages,
        setStart,
        result,
    } = useContext(ResultsContext);
    const navigate = useNavigate();
    const results = useSelector((state) => state.results.results);

    const [status, setStatus] = useState("");
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const docExtensions = ["pdf", "ppt", "doc", "docx"];

    const dispatch = useDispatch();

    //Only fetch data if link is not a file
    useEffect(() => {
        if (preview) {
            dispatch(searchActions.fetchResult(result));

            dispatch(resultActions.getRecentVisitedResults());
        }
    }, [preview, dispatch]);

    useEffect(() => {
        setIsRedditShared(false);
        setLoading(false);
        setIsOnReddit(false);
    }, [preview]);

    //Grab index of the last result to start next load
    useEffect(() => {
        if (results) {
            const lastResultIndex = Number(
                Object.keys(results).slice(-2, -1)[0]
            );
            setStart(lastResultIndex);
        }
    }, [results]);

    const handleNextPage = () => {
        setLoadingResults(true);
        dispatch(
            resultActions.search({
                q: query.join(";"),
                cr: country,
                hl: language,
                engine: engine.toLocaleLowerCase(),
                start: pageNum * 100,
                string: string,
            })
        ).then(async (data) => {
            if (data.results && data.results.info.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }

            if (data.results) {
                setPageNum(pageNum + 1);
                setVisitedResults([]);
                setCurrentSelected(null);
                setLoadingResults(false);
            }
        });
    };

    const handlePreviousPage = () => {
        setLoadingResults(true);
        dispatch(
            resultActions.search({
                q: query.join(";"),
                cr: country,
                hl: language,
                engine: engine.toLocaleLowerCase(),
                start: (pageNum - 2) * 100,
                string: string,
            })
        ).then(async (data) => {
            if (data.results && data.results.info.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }
            if (data.results) {
                setPageNum(pageNum - 1);
                setVisitedResults([]);
                setCurrentSelected(null);
                setLoadingResults(false);
            }
        });
    };

    const goToPage = (e) => {
        e.preventDefault();
        setLoadingResults(true);
        dispatch(
            resultActions.search({
                q: query.join(";"),
                cr: country,
                hl: language,
                engine: engine.toLocaleLowerCase(),
                start: (pageNum - 1) * 100,
                string: string,
            })
        ).then(async (data) => {
            if (data.results && data.results.info.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }

            setVisitedResults([]);
            setCurrentSelected(null);
            setLoadingResults(false);
        });
    };

    const shareToReddit = async (setIsOnReddit) => {
        setLoading(true);
        const baseUrl = (
            preview.includes("https://")
                ? preview.split("https://")
                : preview.split("http://")
        )
            .join("")
            .split("/")[0];

        try {
            const res = await fetch(
                `https://api.pullpush.io/reddit/search/submission/?subreddit=opendirectories&q=${baseUrl}`
            );
            const data = await res.json();
            let foundRedditPost = false;

            for (let redditPost of data.data) {
                if (redditPost.selftext.includes(baseUrl)) {
                    foundRedditPost = true;
                    setIsOnReddit(true);
                    break;
                }
            }

            setLoading(false);

            if (!foundRedditPost) {
                const fullurl =
                    (preview.includes("https://") ? "https://" : "http://") +
                    baseUrl;
                window.open(
                    `https://new.reddit.com/r/opendirectories/submit?text=[${fullurl}](${fullurl})%0A%0AFound using [SearchDeck](http://search-deck.com)&title=BE SURE TO EDIT URL AND INCLUDE PATH TO INDEX BEFORE POSTING`,
                    "_blank"
                );
                setIsRedditShared(true);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        //KEEP CLASS AS IS
        <div
            className={`flex flex-col bg-zinc-900 w-full ${
                width < 640
                    ? "h-[95vh]"
                    : "sm:h-[95vh] md:h-[95vh] lg:[95vh] xl:h-full"
            } items-end`}
            id="search-bar"
        >
            <div className="p-2 w-full">
                <SearchBar status={status} setStatus={setStatus} />
            </div>

            {results && search ? (
                <>
                    <div
                        className={`rounded text-slate-200 h-fit w-full flex flex-row justify-content-${
                            showResult ? "start" : "center"
                        }`}
                        id="result-header"
                    >
                        <div
                            className={`flex justify-content-center justify-self-start p-1 bg-zinc-800 border-b border-zinc-500 ${
                                isMobile
                                    ? "w-full"
                                    : showResult
                                    ? "w-1/2"
                                    : "w-full"
                            }`}
                        >
                            <div className="grid grid-cols-3 w-full items-center px-2">
                                <div
                                    className="flex flex-row items-center justify-self-start poppins-regular text-lg cursor-pointer"
                                    onClick={() => {
                                        navigate("/search/all");
                                        setSearch(false);
                                    }}
                                >
                                    <img src={arrowBack} className="h-7" />
                                    <p>History</p>
                                </div>
                                <div className="grid grid-cols-3 justify-center w-full">
                                    <div></div>
                                    <div className="flex flex-row justify-self-center justify-center">
                                        {pageNum > 1 ? (
                                            <img
                                                src={require("../../assets/icons/triangle-backward.png")}
                                                className="h-6 cursor-pointer"
                                                alt="previous page"
                                                onClick={handlePreviousPage}
                                            />
                                        ) : (
                                            <div className="w-6"></div>
                                        )}
                                        <form onSubmit={(e) => goToPage(e)}>
                                            <input
                                                value={pageNum}
                                                className="w-10 rounded text-center text-slate-600"
                                                onChange={(e) =>
                                                    setPageNum(e.target.value)
                                                }
                                                type="number"
                                            />
                                        </form>
                                        {pageNum < totalPages ||
                                        totalPages === "N/A" ? (
                                            <img
                                                src={require("../../assets/icons/triangle-forward.png")}
                                                className="h-6 cursor-pointer"
                                                alt="next page"
                                                onClick={handleNextPage}
                                            />
                                        ) : (
                                            <div className="w-6"></div>
                                        )}
                                        / <p>{totalPages}</p>
                                    </div>
                                    {results &&
                                    results.info &&
                                    results.info.dmca &&
                                    !showResult &&
                                    !isMobile ? (
                                        <div className="flex flex-row rounded bg-yellow-700 px-2 ml-2 items-center justify-self-end w-full">
                                            <img
                                                src={require("../../assets/icons/caution.png")}
                                                className="h-4"
                                            />
                                            <p>DMCA: Limited results</p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {results &&
                                results.info &&
                                results.info.dmca &&
                                (showResult || isMobile) ? (
                                    <div className="flex flex-row rounded bg-yellow-700 px-2 ml-2 items-center justify-self-end">
                                        <img
                                            src={require("../../assets/icons/caution.png")}
                                            className="h-4"
                                        />
                                        <p>DMCA: Limited results</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        {showResult && isIndex ? (
                            <div className="w-1/2 flex justify-content-end items-center">
                                {!isRedditShared && !isOnReddit && !loading ? (
                                    <p
                                        onClick={async () =>
                                            await shareToReddit(setIsOnReddit)
                                        }
                                        className="bg-orange-600 rounded px-1 border-2 border-white-400 hover:bg-orange-700 cursor-pointer"
                                    >
                                        Share to Reddit
                                    </p>
                                ) : (
                                    <></>
                                )}
                                {!isRedditShared && !isOnReddit && loading ? (
                                    <div className="bg-orange-600 rounded px-1 border-2 border-white-400 flex flex-row items-center justify-content-center h-fit">
                                        <p>Checking Reddit</p>
                                        <img
                                            src={require("../../assets/icons/loading.png")}
                                            className="h-6 w-6 rounded-full animate-spin"
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {isRedditShared && !isOnReddit && !loading ? (
                                    <p className="bg-orange-600 rounded px-1 border-2 border-white-400 ">
                                        Shared to Reddit
                                    </p>
                                ) : (
                                    <></>
                                )}
                                {!isRedditShared && isOnReddit && !loading ? (
                                    <p className="bg-orange-600 rounded px-1 border-2 border-white-400 ">
                                        Already on Reddit
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="flex w-full h-full overflow-auto">
                        <div
                            className={`w-full h-full flex flex-${
                                isMobile ? "col grid grid-rows-2 gap-1" : "row"
                            } overflow-none`}
                        >
                            <Results data={results} />
                            {showResult && preview ? <Browser /> : <></>}
                        </div>
                    </div>
                </>
            ) : loadingResults ? (
                <div className="flex justify-content-center items-center w-full h-full">
                    <img
                        src={require("../../assets/icons/loading.png")}
                        className="h-26 w-26 rounded-full animate-spin mb-4"
                    />
                </div>
            ) : (
                <QueryStats />
            )}
        </div>
    );
}
