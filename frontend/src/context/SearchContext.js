import { createContext, useState, useEffect } from "react";
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState(false);
    const [query, setQuery] = useState([]);
    const [string, setString] = useState("");
    const [visitedResults, setVisitedResults] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [loadingResults, setLoadingResults] = useState(false);
    const [isIndex, setIsIndex] = useState(false);
    const [isRedditShared, setIsRedditShared] = useState(false);
    const [isOnReddit, setIsOnReddit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("");
    const [country, setCountry] = useState("");
    const [engine, setEngine] = useState("Google");
    const [showOptions, setShowOptions] = useState(false);
    const [currCharCount, setCurrCharCount] = useState(0);
    const maxCharCount = 3400;
    useEffect(() => {
        setCurrCharCount((query.join(";") + string).length);
    }, [query, string]);
    useEffect(() => {
        setQuery([]);
    }, [engine]);

    const queryLen = () => (query && query.length) || string
    const hasReachCharLimit = () => currCharCount >= maxCharCount
    return (
        <SearchContext.Provider
            value={{
                search,
                setSearch,
                query,
                setQuery,
                string,
                setString,
                visitedResults,
                setVisitedResults,
                currentSelected,
                setCurrentSelected,
                loadingResults,
                setLoadingResults,
                isIndex,
                setIsIndex,
                isRedditShared,
                setIsRedditShared,
                isOnReddit,
                setIsOnReddit,
                loading,
                setLoading,
                language,
                setLanguage,
                country,
                setCountry,
                engine,
                setEngine,
                showOptions,
                setShowOptions,
                queryLen,
                hasReachCharLimit,
                currCharCount,
                maxCharCount
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
