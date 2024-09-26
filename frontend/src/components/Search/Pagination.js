import {isMobile} from "react-device-detect"

export default function Pagination({currentPage, totalPages}) {
    const pageStart = currentPage < 3 ? 1 : currentPage - 3

    const LastPage = () =>  (currentPage !== pageStart + 5) && (totalPages > 5) ? <PageButton page={totalPages} isCurrent={false} onClick={() => {}} /> : <></>

    return (
        <div className="flex flex-row space-x-1 w-fit">
            {Array.from({ length: totalPages < 5 ? totalPages : 5 }, (_, index) => (
                <PageButton key={index} page={pageStart + index} isCurrent={index === currentPage - 1} />
            ))}
            <LastPage />
        </div>
    )
}

const PageButton = ({ page, isCurrent, onClick }) => {
    return (
        <button onClick={onClick} className={`${isCurrent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-zinc-700 hover:bg-zinc-800'} text-white ${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`}>
            {page}
        </button>
    )
}
