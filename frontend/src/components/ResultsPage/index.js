import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { ResultsContext } from "../../context/ResultsContext";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Results from "../Results";
import Browser from "../Browser";
import * as resultActions from "../../store/result";
import * as searchActions from "../../store/search";
import searchIcon from "../../assets/images/search.png";
import OpenModalButton from "../OpenModalButton";
import NewGroupModal from "../NewGroupModal";

export default function ResultsPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const { preview, showResult, result, groupSelection } = useContext(ResultsContext)

    const saved = useSelector((state) => state.results.saved);
    const visited = useSelector((state) => state.results.visited);
    const data = useSelector((state) => state.search.data);
    const [browseHistory, setBrowseHistory] = useState([]);
    const [filterInput, setFilterInput] = useState("");
    const [viewAll, setViewAll] = useState(true);
    const [limit, setLimit] = useState(25);
    const [selectResources, setSelectResources] = useState(false)

    const docExtensions = ["pdf", "ppt", "doc", "docx"];

    useEffect(() => {
        const options = { limit };
        if (filterInput) options.filter = filterInput;
        dispatch(resultActions.getallResults(options));
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
        const { view, group } = params;
        if (view === "saved") setViewAll(false);
        else if (view === "all") setViewAll(true);
        else setViewAll(true);

        if (group === 'new') setSelectResources(true)
    }, [params]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { limit, saved: !viewAll };
        if (filterInput) options.filter = filterInput;
        dispatch(resultActions.getallResults(options));
    };

    return (
        <div
            className={`flex flex-col  w-full ${isMobile ? "h-full" : "h-full"
                } bg-zinc-900`}
        >
            <div
                className={`flex items-center justify-center pt-2 flex-col ${preview && !isMobile ? "w-1/2" : ""
                    }`}
            >

                <form
                    className={`flex justify-center items-center text-white ${preview && !isMobile
                        ? "w-full flex-col"
                        : (!preview && !isMobile
                            ? "w-1/2 flex-col"
                            : "w-full flex-col")
                        }`}
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="flex flex-row p-2 items-center space-x-2 w-full">
                        <div
                            className={`rounded-full px-2 py-1 flex justify-between w-full my-2 bg-white/5 backdrop-blur-xl`}
                        >
                            <input
                                className="px-1 bg-white/0 rounded w-full outline-none h-full text-white poppins-light text-lg"
                                placeholder="Filter Resources"
                                value={filterInput}
                                onChange={(e) =>
                                    setFilterInput(e.target.value.toLowerCase())
                                }
                            />
                            <button
                                type="submit"
                                className="text-black focus:outline-none cursor-pointer rounded-full h-7 w-7"
                            >
                                <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="search" />
                            </button>
                        </div>
                        <div className="flex flex-row w-fit rounded">
                            <p
                                onClick={() => setViewAll(true)}
                                className={`px-1 cursor-pointer rounded ${viewAll
                                    ? "border-b-4"
                                    : "hover:bg-slate-600 hover:border-b-4 hover:border-gray-400"
                                    }`}
                            >
                                All
                            </p>
                            <p
                                onClick={() => setViewAll(false)}
                                className={`px-1 cursor-pointer rounded ${viewAll
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
                {selectResources ? <div>
                    <OpenModalButton buttonText="Create Group" modalComponent={<NewGroupModal />} className={`h-10 text-white flex items-center ${groupSelection.length ? 'bg-blue-700' : 'bg-zinc-500 !text-zinc-800'} rounded px-2`} />
                </div> : <div>
                </div>}
            </div>
            <div
                className={`flex w-full h-full overflow-y-hidden ${isMobile ? "grid grid-rows-2 gap-1 flex-col" : ""
                    }`}
            >
                {saved && !viewAll ? (
                    <>
                        <Results
                            data={saved}
                            selectResources={selectResources}
                        />
                    </>
                ) : (
                    <></>
                )}
                {visited && viewAll ? (
                    <>
                        <Results
                            data={visited}
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
