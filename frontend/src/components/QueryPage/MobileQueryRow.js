import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { SearchContext } from "../../context/SearchContext";
import { isMobile } from "react-device-detect";
import * as queryActions from "../../store/query";
import * as searchActions from "../../store/search";

export default function MobileQueryRow({ query }) {
    const { setString, setQuery, setShowOptions, searchState, setEngine } = useContext(SearchContext);
    const dispatch = useDispatch();
    const [hover, setHover] = useState(false);

    const createdAt = new Date(query.createdAt);
    let hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const date = `${createdAt.getMonth() + 1
        }-${createdAt.getDate()}`;
    const time = `${hours}:${formattedMinutes} ${ampm}`;

    const updateQuery = (queryId) => {
        dispatch(queryActions.updateQuery(queryId)).then(() =>
            dispatch(searchActions.getRecentSavedQueries())
        );
    };

    const addToSearch = (query) => {
        setString(query.string);
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
        setString(query.string);
        setQuery(result);
        const engineUpperCase = query.engine[0].toUpperCase() + query.engine.slice(1);
        setEngine(engineUpperCase);
        searchState.updateQuery({string: query.string, q: query.query, engine: query.engine});
        setShowOptions(true);
    };
    return (
        <div
            className="flex flex-row grid grid-cols-9 divide divide-x justify-between w-full py-1 hover:bg-zinc-700 items-center rounded-md bg-zinc-800"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => addToSearch(query)}
        >
            <div className="flex flex-row col-span-6 justify-between h-fit w-full">
                <img
                    src={
                        query.saved
                            ? require("../../assets/icons/bookmark_FILL.png")
                            : require("../../assets/icons/bookmark.png")
                    }
                    alt={query.saved ? "unsave" : "save"}
                    className="h-8 cursor-pointer"
                    onClick={() => updateQuery(query.id)}
                />
                <div className="px-2 w-full">
                    <p className="text-sm text-white break-all whitespace-pre-wrap overflow-wrap-anywhere hyphens-auto" style={{ wordBreak: 'break-word' }}>
                        {query.string
                            ? query.query + " " + query.string
                            : query.query}
                    </p>
                </div>
            </div>
            <div
                className={`col-span-2 flex flex-${isMobile ? "col" : "row"
                    } items-center justify-center`}
            >
                <p>{date}</p>
                <p>{time}</p>
            </div>
            <div
                className={`col-span-${isMobile ? "1" : "1/3"
                    } flex items-center justify-center h-full`}
            >
                {query.engine === "google" ? (
                    <img
                        className="h-7 rounded"
                        src={require("../../assets/icons/google.png")}
                        alt="google"
                    />
                ) : (
                    <img
                        className="h-7 rounded"
                        src={require("../../assets/icons/bing.jpg")}
                        alt="bing"
                    />
                )}
            </div>
        </div>
    );
}
