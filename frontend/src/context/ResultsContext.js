import { createContext, useState, useEffect } from "react";
export const ResultsContext = createContext();

export const ResultsProvider = ({ children }) => {
    const [preview, setPreview] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [newPageNum, setNewPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [start, setStart] = useState(0);
    const [result, setResult] = useState({});
    const [groupSelection, setGroupSelection] = useState([])

    useEffect(() => {
        // console.log(groupSelection)
    },[groupSelection])

    return (
        <ResultsContext.Provider
            value={{
                preview,
                setPreview,
                showResult,
                setShowResult,
                pageNum,
                setPageNum,
                newPageNum,
                setNewPageNum,
                totalPages,
                setTotalPages,
                start,
                setStart,
                result,
                setResult,
                groupSelection,
                setGroupSelection
            }}
        >
            {children}
        </ResultsContext.Provider>
    );
};
