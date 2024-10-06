import { useContext, useState } from "react"
import { isMobile } from "react-device-detect"
import { SearchContext } from "../../context/SearchContext"
import { ResultsContext } from "../../context/ResultsContext"
import * as resultActions from "../../store/result"
import { useDispatch, useSelector } from "react-redux"

export default function Pagination({ handlePreviousPage, handleNextPage }) {
    const results = useSelector((state) => state.results.results);
    const dispatch = useDispatch()
    const {
        setLoadingResults,
        showResult,
        clickHistory,
        searchState
    } = useContext(SearchContext);
    const {
        pageNum,
        setPageNum,
        totalPages,
        setTotalPages,
        newPageNum,
        setNewPageNum,
    } = useContext(ResultsContext);
    const pageStart = pageNum <= 3 ? 1 : pageNum
    const [isWarning, setIsWarning] = useState(results?.info?.dmca && !showResult && !isMobile)
    const goToPage = (e, userSelection) => {
        e.preventDefault();
        if (Number(newPageNum) > Number(totalPages)) {
            return
        }
        setLoadingResults(true);
        dispatch(
            resultActions.search({
                q: searchState.query.join(";"),
                cr: searchState.country,
                hl: searchState.language,
                engine: searchState.engine.toLocaleLowerCase(),
                start: ((userSelection || newPageNum) - 1) * 100,
                string: searchState.string,
            })
        ).then(async (data) => {
            if (data.results && data.results.info.totalPages) {
                setTotalPages(data.results.info.totalPages);
            }
            if (data.results && data.results.info.currentPage) {
                setPageNum(data.results.info.currentPage);
                setNewPageNum(data.results.info.currentPage);
            }

            clickHistory.setVisitedResults([]);
            clickHistory.setCurrentSelected(null);
            setLoadingResults(false);
        });
    };

    const LastPage = () => (pageNum !== pageStart + 5) && (totalPages > 5) ? <p>{totalPages}</p> : <></>
    const PreviousPage = () => pageNum > 1 ? (
        <div className="rounded-full bg-zinc-700 w-8 h-8 flex justify-center items-center hover:bg-zinc-600">

            <img
                src={require("../../assets/icons/triangle-backward.png")}
                className="h-6 cursor-pointer"
                alt="previous page"
                onClick={handlePreviousPage}
            />
        </div>
    ) : (
        <div className="w-8 h-8"></div>
    )

    const NextPage = () => pageNum < totalPages ||
        totalPages === "N/A" ? (
        <div className="rounded-full bg-zinc-700 w-8 h-8 flex justify-center items-center hover:bg-zinc-600 cursor-pointer"
            onClick={handleNextPage}>
            <img
                src={require("../../assets/icons/triangle-forward.png")}
                className="h-6"
                alt="next page"
            />
        </div>
    ) : (
        <div className="w-8 h-8"></div>
    )

    return (
        <div className="flex flex-row justify-between w-full col-span-2" id="pagination">
            <div className="w-full col-span-1 flex justify-center">
                <div className="flex flex-row space-x-1 w-fit items-center">

                    <PreviousPage />
                    {Array.from({ length: 5 }, (_, index) => {
                        const thisPage = pageStart + index
                        if (thisPage > totalPages) {
                            return <div className="w-8 h-8"></div>
                        }
                        return <PageButton key={index} page={thisPage} isCurrent={thisPage === pageNum} onClick={(e) => goToPage(e, thisPage)} />
                    }
                    )}
                    <NextPage />
                </div>
                {/* <LastPage /> */}
            </div>
            {isWarning ? (
                <div className="col-span-1flex flex-row rounded bg-yellow-700 px-2 ml-2 items-center justify-self-end w-full">
                    <img src={require("../../assets/icons/caution.png")} className="h-4" alt="dmca limited results"/>
                    <p>DMCA: Limited results</p>
                </div>
            ) : (
                <div></div>
            )}
            <form onSubmit={(e) => goToPage(e)} className={`flex flex-row items-center justify-end w-full`}>
                <p className={`${isMobile ? 'text-sm' : ''} text-zinc-300 mr-2`}>Go to: </p>
                <input
                    value={newPageNum}
                    className="w-10 rounded text-center text-white bg-zinc-700"
                    onChange={(e) => {
                        setNewPageNum(e.target.value)
                    }}
                    type="number"
                />
            </form>
        </div>
    )
}

const PageButton = ({ page, isCurrent, onClick }) => {
    return (
        <button onClick={onClick} className={`${isCurrent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-zinc-700 hover:bg-zinc-800'} text-white ${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full focus:outline-none`}>
            {page}
        </button>
    )
}
