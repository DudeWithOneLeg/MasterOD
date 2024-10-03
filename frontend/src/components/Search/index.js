import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import * as searchActions from "../../store/search";
import { isMobile } from "react-device-detect";
import Results from "../Results";
import Browser from "../Browser";
import SearchBar from "./SearchBar";
import QueryPage from "../QueryPage";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import ResultInfo from "./ResultInfo";
import MobileResultInfo from "./MobileResultInfo";
export default function Search() {
    const {
        search,
        loadingResults,
        setIsRedditShared,
        setIsOnReddit,
        setLoading,
    } = useContext(SearchContext);
    const {
        preview,
        showResult,
        setStart,
        result,
    } = useContext(ResultsContext);
    const navigate = useNavigate()
    const results = useSelector((state) => state.results.results);
    const user = useSelector (state => state.session.user)

    const [status, setStatus] = useState("");
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [navigate, user]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (preview) {
            dispatch(searchActions.fetchResult(result));
        }
    }, [preview, dispatch]);

    useEffect(() => {
        setIsRedditShared(false);
        setLoading(false);
        setIsOnReddit(false);
    }, [preview, setIsRedditShared, setLoading, setIsOnReddit]);

    useEffect(() => {
        if (results) {
            const lastResultIndex = Number(Object.keys(results).slice(-2, -1)[0]);
            setStart(lastResultIndex);
        }
    }, [results, setStart]);

    return (
        <div className={`flex flex-col w-full ${width < 640 ? "h-[95vh]" : "sm:h-[95vh] md:h-[95vh] lg:h-[95vh] xl:h-full"} items-end bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden z-10`} id="search-bar">
            <SearchBar status={status} setStatus={setStatus} />
            {results && search ? (
                <div className="flex flex-col h-full w-full overflow-hidden justify-center items-center">
                    {isMobile ? <MobileResultInfo /> : <ResultInfo />}
                    <div className={`flex-grow w-full flex ${isMobile ? "flex-col" : "flex-row"} overflow-hidden transition-all duration-300 ease-in-out px-2`}>
                        <div className={`${showResult && !isMobile ? 'w-full' : 'w-full'} h-full overflow-hidden`}>
                            <Results data={results} />
                        </div>
                        {showResult && preview && <Browser />}
                    </div>
                </div>
            ) : loadingResults ? (
                <div className="flex justify-center items-center w-full h-full">
                    <img src={require("../../assets/icons/loading.png")} className="h-26 w-26 rounded-full animate-spin mb-4" alt="loading"/>
                </div>
            ) : (
                <QueryPage />
            )}
        </div>
    );
}
