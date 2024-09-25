import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import SaveResult from "../SaveResult";
import { isMobile } from "react-device-detect";
const newTab = require("../../assets/icons/open_in_new.png");

export default function ResultCard({ data, rowKey }) {
    const {
        currentSelected,
        setCurrentSelected,
        visitedResults,
        setVisitedResults,
        setIsIndex,
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
        setCurrentSelected(result.id);
        setVisitedResults([...visitedResults, result.id]);
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
                currentSelected === result.id
                    ? "border-2 border-green-400"
                    : visitedResults?.includes(result.id) &&
                      currentSelected !== result.id
                    ? "border-2 border-white"
                    : ""
            } ${
                isMobile ? "text-sm" : ""
            } h-fit w-full cursor-pointer flex items-center rounded bg-zinc-800 hover:bg-zinc-700 py-2 mb-2 mr-1 transition-all duration-100 ease-in-out `}
            onClick={handleClick}
        >
            <div className="flex flex-col items-center justify-content-around min-w-10 h-full">
                {/* <div className="text-white">{result.id}</div> */}
                <SaveResult result={result} saved={saved} setSaved={setSaved} />
                {result.title &&
                result.title.toLowerCase().includes("index of /") ? (
                    <div className="rounded bg-green-200 w-6 my-1">Idx</div>
                ) : (
                    <></>
                )}
                {/* <div className="flex font-bold h-fit w-fit bg-slate-300 rounded"></div> */}
            </div>
            <div
                className="flex flex-col items-start h-full w-full"
                
            >
                {result ? (
                    <div
                        key={result.id}
                        className={`flex flex-col text-slate-400 h-fit w-full`}
                    >
                        <div className="flex flex-row ">
                            <div className="w-full">
                                <div className="flex flex-row justify-between items-center w-full">
                                    <div className="flex flex-row">
                                        <h3
                                            className={`font-bold text-zinc-300 ${
                                                isMobile ? "text-sm" : "text-xl"
                                            } text-wrap underline w-fit poppins-light`}
                                        >
                                            {result.title && result.title}
                                        </h3>

                                        {result.link &&
                                            docExtensions.includes(
                                                result.link
                                                    .split(".")
                                                    .slice(-1)[0]
                                            ) && (
                                                <img
                                                    src={require("../../assets/images/document.png")}
                                                    className={`w-${
                                                        isMobile ? "6" : "8"
                                                    }`}
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
                                    {result.link ?
                                        result.link
                                        .split("")
                                        .slice(0, 50)
                                        .join("") : ""}
                                    ...
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="underline w-fit text-zinc-300">{result.snippet}</p>
                        </div>

                        {result.archive &&
                            result.archive.archived_snapshots &&
                            result?.archive?.archived_snapshots?.closest
                                ?.url && (
                                <a
                                    href={
                                        result.archive.archived_snapshots
                                            .closest.url
                                    }
                                    target="_blank"
                                    className="font-bold text-zinc-400 w-fit"
                                    rel="noreferrer"
                                >
                                    Archive
                                </a>
                            )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
