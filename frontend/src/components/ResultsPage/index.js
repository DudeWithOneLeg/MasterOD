import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { ResultsContext } from "../../context/ResultsContext";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Results from "../Results";
import Browser from "../Browser";
import * as searchActions from "../../store/search";
import OpenModalButton from "../OpenModalButton";
import NewGroupModal from "../NewGroupModal";
import ResultsPageFilters from "./ResultsPageFilters";

export default function ResultsPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const { preview, showResult, result, resourceSelection, setResourceSelection } = useContext(ResultsContext)

    const results = useSelector((state) => state.results.all);
    const data = useSelector((state) => state.search.data);
    const [browseHistory, setBrowseHistory] = useState([]);
    const [selectResources, setSelectResources] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const docExtensions = ["pdf", "ppt", "doc", "docx"];

    useEffect(() => {
        const { group } = params;
        if (group === 'new') setSelectResources(true)
            else setSelectResources(false)
    }, [params]);

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

    const cancelresourceSelection = () => {
        setSelectResources(false)
        setResourceSelection([])
    }

    return (
        <div
            className={`flex flex-col ${preview && !isMobile ? "items-start" : "items-center"} w-full h-full bg-zinc-900`}
        >
            <div
                className={`flex items-center justify-center pt-2 flex-col ${showResult || isMobile ? "w-full" : "3xl:w-1/2 2xl:w-1/2 xl:w-full lg:w-full md:w-full"}`}

            >
                <ResultsPageFilters setIsLoading={setIsLoading}/>
                {selectResources ? <div className="w-full flex flex-row text-white items-center space-x-2 px-2">
                    <OpenModalButton buttonText="Create Group" modalComponent={<NewGroupModal setSelectResources={setSelectResources}/>} className={`h-10 text-white flex items-center ${resourceSelection.length ? 'bg-blue-700' : 'bg-zinc-500 !text-zinc-800'} rounded px-2`} />
                    <h2 onClick={cancelresourceSelection} className="cursor-pointer">Cancel</h2>
                </div> : <div>
                </div>}
            </div>
            <div
                className={`flex w-full h-full overflow-y-hidden ${isMobile ? "grid grid-rows-2 gap-1 flex-col" : "md:flex-col"
                    }`}
            >
                {results && !isLoading ? (
                    <>
                        <Results
                            data={results}
                            selectResources={selectResources}
                        />
                    </>
                ) : (
                    <></>
                )}
                {(showResult && data) || (showResult && preview) ? (
                    <Browser
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
