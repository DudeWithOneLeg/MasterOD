import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SearchContext } from "../../context/SearchContext";
import { ResultsContext } from "../../context/ResultsContext";
import SaveResult from "../SaveResult";
import { isMobile } from "react-device-detect";
import MobileResultCard from "./MobileResultCard";
const newTab = require("../../assets/icons/open_in_new.png");


export default function ResultCard({ data, rowKey, displayOnly, index, selectResources }) {
    const {
        setIsIndex,
        clickHistory
    } = useContext(SearchContext);
    const { setShowResult, setPreview, setResult, resourceSelection, setResourceSelection } = useContext(ResultsContext);

    const [showInfo, setShowInfo] = useState(false);
    const [saved, setSaved] = useState(false);
    const [lastSearchId, setLastSearchId] = useState(0);
    const lastSearch = useSelector((state) => state.search.recentQueries);
    const [isSelected, setIsSelected] = useState(false);
    const docExtensions = ["pdf", "doc", "docx", "ppt", "pptx"];
    const result = data[rowKey];

    useEffect(() => {
        if (lastSearch && Object.values(lastSearch)[0]) {
            setLastSearchId(Object.values(lastSearch)[0].id);
        }
    }, [lastSearch]);

    useEffect(() => {
        if (!resourceSelection.length) setIsSelected(false)
    }, [resourceSelection])

    const handleClick = () => {
        if (displayOnly) return;
        setIsIndex(false);
        const newResult = { ...data[rowKey] };
        newResult.queryId = lastSearchId;
        setShowInfo(!showInfo);
        setShowResult(true);
        setResult(newResult);
        setPreview(data[rowKey].link);
        clickHistory.setCurrentSelected(index);
        clickHistory.setVisitedResults([...clickHistory.visitedResults, index]);
        if (result.title.toLowerCase().includes("index of /")) setIsIndex(true);
        return;
    };

    const handleNewTab = () => {
        if (displayOnly) return;
        const link = data[rowKey].link;
        window.open(link, "_blank");
        return;
    };

    const handleresourceSelection = (e) => {
        setIsSelected(e.target.checked)

        if (e.target.checked) {
            setResourceSelection([...resourceSelection, result.id])
        }
        else {
            const newresourceSelection = resourceSelection.filter(id => id !== result.id)
            setResourceSelection([...newresourceSelection])
        }
    }



    if (isMobile) return <MobileResultCard data={data} rowKey={rowKey} selectResources={selectResources}/>

    return (
        <div
            key={rowKey}
            data-collapse-target="collapse"
            data-collapse="collapse"
            id="result"
            className={`${!displayOnly ? (clickHistory.currentSelected == index
                ? "border-2 !border-green-400"
                : (clickHistory.visitedResults?.includes(index) &&
                    clickHistory.currentSelected !== index
                    ? "border-2 border-white"
                    : "")
            ) : ''} h-fit py-2 mb-2 mr-1 pr-2 border-2 border-zinc-600 min-w-fit max-w-full cursor-pointer flex items-center rounded ${!displayOnly ? 'hover:border-2 hover:border-green-400' : ''} bg-zinc-900 hover:bg-zinc-800`}

        >
            <div className="flex flex-col items-center justify-content-around min-w-10 h-full space-y-2">
                {/* <div className="text-white">{result.id}</div> */}
                {selectResources ? <input checked={isSelected} onChange={handleresourceSelection} type='checkbox' className="w-6 h-6 cursor-pointer"/>
                    : <SaveResult result={result} saved={saved} setSaved={setSaved} displayOnly={displayOnly}/>}
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
                onClick={handleClick}
            >
                {result ? (
                    <div
                        key={result.id}
                        className={`flex flex-col text-slate-400 h-fit w-full`}
                    >
                        <div className="flex flex-row w-full">
                            <div className="w-full">
                                <div className="flex flex-row justify-between items-center w-full">
                                    <div className="flex flex-row w-full">
                                        <h3
                                            className={`font-bold text-xl text-wrap underline w-fit poppins-bold text-slate-200`}
                                        >
                                            {result.title ? result.title : ''}
                                        </h3>

                                        {result.link &&
                                            docExtensions.includes(
                                                result.link
                                                    .split(".")
                                                    .slice(-1)[0]
                                            ) && (
                                                <img
                                                    src={require("../../assets/images/document.png")}
                                                    className={`w-${isMobile ? "6" : "8"
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
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
