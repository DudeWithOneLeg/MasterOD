import { useState } from "react";
import { useDispatch } from "react-redux";
import * as queryActions from "../../store/query";
import * as searchActions from '../../store/search'

export default function QueryRow({ query, setString, setQuery }) {
    const dispatch = useDispatch()
    const [hover, setHover] = useState(false)

    const updateQuery = (queryId) => {
        dispatch(queryActions.updateQuery(queryId)).then(() =>
            dispatch(searchActions.getRecentSavedQueries())
        );
    };

    const addToSearch = (query) => {
        setString(query.string);
        setQuery(query.query.split('" ').join('";').split(";"));
    };
    return (
        <div
        className="flex flex-row divide divide-x justify-content-between w-full p-1 hover:bg-slate-500"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        >
        <div className="flex flex-row w-1/3">
            <img
            src={
                query.saved
                ? require("../../assets/icons/bookmark_FILL.png")
                : require("../../assets/icons/bookmark.png")
            }
            alt={
                query.saved
                ? 'unsave'
                : 'save'
            }
            className="h-8 cursor-pointer"
            onClick={() => updateQuery(query.id)}
            />
            <p className="w-full flex align-items-center justify-content-center">
            {query.string ? query.query + " " + query.string : query.query}
            </p>
            <div>
            {hover ? <img
                src={require("../../assets/images/search.png")}
                className="h-8 w-8 cursor-pointer"
                onClick={() => addToSearch(query)}
                alt='add to search'
            /> : <div className="w-8"></div>}
            </div>
        </div>
        <p className="w-1/3 flex align-items-center justify-content-center">
            {new Date(query.createdAt).toString()}
        </p>
        <div className="w-1/3 flex align-items-center justify-content-center">
            {query.engine === "google" ? (
            <img
                className="h-7 rounded"
                src={require("../../assets/icons/google.png")}
                alt='google'
            />
            ) : (
            <img
                className="h-7 rounded"
                src={require("../../assets/icons/bing.jpg")}
                alt='bing'
            />
            )}
        </div>
        </div>
    );
}
