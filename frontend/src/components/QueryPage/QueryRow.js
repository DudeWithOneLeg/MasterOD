import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { SearchContext } from "../../context/SearchContext";
import googleIcon from "../../assets/icons/google.png"
import bingIcon from "../../assets/icons/bing.jpg"
import bookmarkFillIcon from "../../assets/icons/bookmark_FILL.png"
import bookmarkIcon from "../../assets/icons/bookmark.png"
import * as queryActions from "../../store/query";
import * as searchActions from "../../store/search";

export default function QueryRow({ query }) {
    const { setShowOptions, searchState } = useContext(SearchContext);
    const dispatch = useDispatch();
    const [hover, setHover] = useState(false);

    const createdAt = new Date(query.createdAt);
    let hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const time = `${hours}:${formattedMinutes} ${ampm}`;

    const updateQuery = (queryId) => {
        dispatch(queryActions.updateQuery(queryId)).then(() =>
            dispatch(searchActions.getRecentSavedQueries())
        );
    };

    const addToSearch = (query) => {
        const regex = /(\w+:)(?:"([^"]*)"|(\S+))|(\S+)/g;
        const result = [];
        let match;

        while ((match = regex.exec(query.query)) !== null) {
            if (match[1]) {
                // Operator:value pair
                const operator = match[1];
                const value =
                match[2] !== undefined ? ((match[2][0] === '"' && match[2][match[2].length - 1] === '"') ? match[2] : `"${match[2]}"`) : match[3];
                result.push(`${operator}${value}`);
            } else {
                // Single word without operator
                result.push(match[4]);
            }
        }

        searchState.setString(query.string);
        searchState.setQuery(result);
        const engineUpperCase = query.engine[0].toUpperCase() + query.engine.slice(1);
        searchState.setEngine(engineUpperCase);
        searchState.updateQuery({string: query.string, q: query.query, engine: query.engine, query: result});
        setShowOptions(true);
    };
    return (
        <div
            className={`flex flex-col w-fit min-w-60 ${hover ? 'p-4' : 'p-2'} max-w-full bg-zinc-800 h-fit rounded m-1 cursor-pointer transition-all duration-500 ease-in-out mb-2`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            key={query.id}
        >
            {/* Top Row: Bookmark, Time, Search Icon */}
            <div className="flex flex-row justify-between h-fit border-b border-zinc-400 min-w-60">
                {/* Bookmark Icon - Fixed Width, No Shrink */}
                <div className="flex flex-row w-fit flex-shrink-0">
                    <img
                        src={
                            query.saved
                                ? bookmarkFillIcon
                                : bookmarkIcon
                        }
                        alt={query.saved ? "unsave" : "save"}
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => updateQuery(query.id)}
                    />
                    <div className="flex items-center justify-center text-zinc-400 pl-1 border-l border-zinc-500">
                        <p className="min-w-fit h-fit">{time}</p>
                    </div>
                </div>

                {/* Time */}

                {/* Search Icon */}
                <div className="flex justify-end items-center">
                    {hover ? (
                        <img
                            src={require("../../assets/images/search.png")}
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => addToSearch(query)}
                            alt="add to search"
                        />
                    ) : (
                        <div className="w-8 h-8"></div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Google/Bing Icon and Query Text */}
            <div className="flex flex-row">
                {/* Google/Bing Icon - Fixed Width, No Shrink */}
                <div className="flex items-start justify-start h-fit p-1 w-8 flex-shrink-0">
                    <img
                        className="min-w-6 max-w-6 h-6 rounded"
                        src={
                            query.engine === "google"
                                ? googleIcon
                                : bingIcon
                        }
                        alt={query.engine === "google" ? "google" : "bing"}
                    />
                </div>
                {/* Query Text */}
                <div className="w-full max-h-40 min-h-20 max-w-60 overflow-y-scroll no-scrollbar pt-1 border-l border-zinc-500 bg-zinc-900">
                    <p className="text-wrap max-h-40 min-h-20 w-full pl-1">
                        {query.string
                            ? query.query + " " + query.string
                            : query.query}
                    </p>
                </div>
            </div>
        </div>
    );
}
