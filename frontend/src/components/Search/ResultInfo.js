import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ResultsContext } from "../../context/ResultsContext";
import { SearchContext } from "../../context/SearchContext";
import * as resultActions from "../../store/result";
import { isMobile } from "react-device-detect";
import arrowBack from "../../assets/images/arrow-back.png";
import Pagination from "./Pagination";
import MobilePagination from "./MobilePagination";

export default function ResultInfo() {
    const {
        preview,
        showResult,
        pageNum,
        setPageNum,
        setTotalPages,
        setNewPageNum
    } = useContext(ResultsContext);
    const {
        setSearch,
        query,
        string,
        setVisitedResults,
        setCurrentSelected,
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
        searchState
    } = useContext(SearchContext);
    const results = useSelector((state) => state.results.results);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNextPage = () => {
        setLoadingResults(true);
        console.log(searchState.currentSearchStatus)
        dispatch(resultActions.search({
            q: query.join(";"),
            cr: country,
            hl: language,
            engine: engine.toLowerCase(),
            start: pageNum * 100,
            string: string,
        })).then(data => {
            if (data.results?.info?.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }
            if (data.results) {
                setPageNum(pageNum + 1);
                setNewPageNum(pageNum + 1);
                setVisitedResults([]);
                setCurrentSelected(null);
                searchState.updateQuery({pageNum: pageNum + 1});
            }
            setLoadingResults(false);
        });
    };

    const handlePreviousPage = () => {
        setLoadingResults(true);
        dispatch(resultActions.search({
            q: query.join(";"),
            cr: country,
            hl: language,
            engine: engine.toLowerCase(),
            start: (pageNum - 2) * 100,
            string: string,
        })).then(data => {
            if (data.results?.info?.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }
            if (data.results) {
                setPageNum(pageNum - 1);
                setNewPageNum(pageNum - 1);
                setVisitedResults([]);
                setCurrentSelected(null);
            }
            setLoadingResults(false);
        });
    };

    const shareToReddit = async (setIsOnReddit) => {
        setLoading(true);
        const baseUrl = preview.replace(/https?:\/\//, "").split("/")[0];

        try {
            const res = await fetch(`https://api.pullpush.io/reddit/search/submission/?subreddit=opendirectories&q=${baseUrl}`);
            const data = await res.json();
            const foundRedditPost = data.data.some(redditPost => redditPost.selftext.includes(baseUrl));

            setLoading(false);

            if (!foundRedditPost) {
                const fullUrl = `${preview.includes("https://") ? "https://" : "http://"}${baseUrl}`;
                window.open(`https://new.reddit.com/r/opendirectories/submit?text=[${fullUrl}](${fullUrl})%0A%0AFound using [SearchDeck](http://search-deck.com)&title=BE SURE TO EDIT URL AND INCLUDE PATH TO INDEX BEFORE POSTING`, "_blank");
                setIsRedditShared(true);
            } else {
                setIsOnReddit(true);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className={`text-slate-200 h-fit w-full flex flex-row py-2 justify-${showResult ? "start" : "center"}`} id="result-info">
            <div className={`flex justify-center justify-self-start px-1 bg-zinc-900 ${isMobile ? '' : 'pb-1'} ${isMobile ? 'w-full' : showResult ? 'w-1/2' : 'w-3/5'} transition-all duration-300 ease-in-out `}>
                <div className={`grid grid-cols-3 w-full items-center px-2 ${isMobile ? 'w-full' : showResult ? 'w-1/2' : 'w-full'} `}>
                    <div className="flex flex-row items-center justify-self-start poppins-regular text-lg cursor-pointer col-span-1 w-full" onClick={() => { navigate("/search/all"); setSearch(false); }}>
                        <img src={arrowBack} className="h-7" alt="arrow back"/>
                        <p>History</p>
                    </div>

                        {results?.info?.dmca && (showResult || isMobile) && (
                            <div className="flex flex-row rounded bg-yellow-700 px-2 ml-2 items-center justify-self-end col-span-1">
                                <img src={require("../../assets/icons/caution.png")} className="h-4" alt="dmca result warning"/>
                                <p>DMCA: Limited results</p>
                            </div>
                        )}

                        {isMobile ? <MobilePagination handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} /> : <Pagination handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} />}

                </div>
            </div>
            {showResult && isIndex && (
                <div className="w-1/2 flex justify-end items-center">
                    {!isRedditShared && !isOnReddit && !loading && (
                        <p onClick={async () => await shareToReddit(setIsOnReddit)} className="bg-orange-600 rounded px-1 border-2 border-white-400 hover:bg-orange-700 cursor-pointer">
                            Share to Reddit
                        </p>
                    )}
                    {!isRedditShared && !isOnReddit && loading && (
                        <div className="bg-orange-600 rounded px-1 border-2 border-white-400 flex flex-row items-center justify-center h-fit">
                            <p>Checking Reddit</p>
                            <img src={require("../../assets/icons/loading.png")} className="h-6 w-6 rounded-full animate-spin" alt="loading"/>
                        </div>
                    )}
                    {isRedditShared && !isOnReddit && !loading && (
                        <p className="bg-orange-600 rounded px-1 border-2 border-white-400">Shared to Reddit</p>
                    )}
                    {!isRedditShared && isOnReddit && !loading && (
                        <p className="bg-orange-600 rounded px-1 border-2 border-white-400">Already on Reddit</p>
                    )}
                </div>
            )}

        </div>
    );
}
