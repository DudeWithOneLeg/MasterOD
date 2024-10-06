import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import SaveResult from "../SaveResult";
import { isMobile } from "react-device-detect";
const newTab = require("../../assets/icons/open_in_new.png");

export default function MobileResultCard({ data, rowKey }) {
    const {
        setIsIndex,
        clickHistory
    } = useContext(SearchContext);
    const { setShowResult, setPreview, setResult } = useContext(ResultsContext);

    const [showInfo, setShowInfo] = useState(false);
    const [saved, setSaved] = useState(false);
    const [lastSearchId, setLastSearchId] = useState(0);
    const lastSearch = useSelector((state) => state.search.recentQueries);

    useEffect(() => {
        if (lastSearch && Object.values(lastSearch)[0]) {
            setLastSearchId(Object.values(lastSearch)[0].id);
        }
    }, [lastSearch]);

    const docExtensions = ["pdf", "doc", "docx", "ppt", "pptx"];
    const result = data[rowKey];

    const handleClick = () => {
        setIsIndex(false);
        const newResult = { ...data[rowKey] };
        newResult.queryId = lastSearchId;
        setShowInfo(!showInfo);
        setShowResult(true);
        setResult(newResult);
        setPreview(data[rowKey].link);
        clickHistory.setCurrentSelected(result.id);
        clickHistory.setVisitedResults([...clickHistory.visitedResults, result.id]);
        if (result.title.toLowerCase().includes("index of /")) setIsIndex(true);
        return;
    };

    const handleNewTab = () => {
        const link = data[rowKey].link;
        window.open(link, "_blank");
        return;
    };

    // console.log(result)

    return (
        <div
    key={rowKey}
    data-collapse-target="collapse"
    data-collapse="collapse"
    id="result"
    className={`${
        clickHistory.currentSelected === result.id
            ? "border-2 border-green-400"
            : clickHistory.visitedResults?.includes(result.id) &&
              clickHistory.currentSelected !== result.id
            ? "border-2 border-white"
            : ""
    } ${isMobile ? "text-sm" : ""} w-full cursor-pointer flex flex-row rounded hover:bg-zinc-700 py-2 pr-2 my-2 pl-0 transition-all duration-100 ease-in-out bg-gradient-to-r from-zinc-800 to-zinc-900`}
    onClick={handleClick}
>
    {/* First Child */}
    <div className="flex items-start justify-center w-[8%] h-auto py-2">
        <SaveResult result={result} saved={saved} setSaved={setSaved} className={`${isMobile ? 'w-6 h-6' : 'w-fit'}`}/>
        {result.title && result.title.toLowerCase().includes("index of /") ? (
            <div className="rounded bg-green-200 w-6">Idx</div>
        ) : null}
    </div>

    {/* Second Child */}
    <div className="flex flex-col items-start justify-between w-[92%]">
        {result ? (
            <div key={result.id} className="flex flex-col text-white w-full">
                <div className="flex flex-row">
                    <div className="w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-row w-fit items-center">
                                <h3
                                    className={`font-bold text-white ${
                                        isMobile ? "text-sm" : "text-xl"
                                    } underline w-fit poppins-regular`}
                                >
                                    {result.title ? result.title.slice(0, 45) : ""}
                                </h3>

                                {result.link &&
                                    docExtensions.includes(
                                        result.link.split(".").slice(-1)[0]
                                    ) && (
                                        <img
                                            src={require("../../assets/images/document.png")}
                                            className={`${isMobile ? "w-6 h-6" : "w-8 h-8"}`}
                                            alt="document"
                                        />
                                    )}
                            </div>
                            <img
                                src={newTab}
                                className={`h-${isMobile ? "6" : "8"}`}
                                onClick={handleNewTab}
                                alt="new tab"
                            />
                        </div>
                        <p className="truncate text-zinc-400 w-3/4">
                            {result.link ? result.link.slice(0, 50) : ""}
                            ...
                        </p>
                    </div>
                </div>
                <div className="w-full">
                    <p className={`underline text-zinc-300 ${isMobile ? 'text-sm' : 'text-lg'}`}>{result.snippet}</p>
                </div>

                {/* {result.archive?.archived_snapshots?.closest?.url && (
                    <a
                        href={result.archive.archived_snapshots.closest.url}
                        target="_blank"
                        className="font-bold text-zinc-400 w-fit"
                        rel="noreferrer"
                    >
                        Archive
                    </a>
                )} */}
            </div>
        ) : null}
    </div>
</div>

    );
}
