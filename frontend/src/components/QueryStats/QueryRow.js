import { useState } from "react";
import { useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";
import * as queryActions from "../../store/query";
import * as searchActions from "../../store/search";

export default function QueryRow({
  query,
  setString,
  setQuery,
  showOptions,
  setShowOptions
 }) {
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);
  const createdAt = new Date(query.createdAt);
  let hours = createdAt.getHours();
  const minutes = createdAt.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const date = `${
    createdAt.getMonth() + 1
  }-${createdAt.getDate()}-${createdAt.getFullYear()}`;
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
        const value = match[2] !== undefined ? `"${match[2]}"` : match[3];
        result.push(`${operator}${value}`);
      } else {
        // Single word without operator
        result.push(match[4]);
      }
    }

    setQuery(result);
    setShowOptions(true)
  };
  return (
    <div
      className="flex flex-row grid grid-cols-9 divide divide-x justify-between w-full p-1 hover:bg-zinc-500"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-row col-span-6 justify-between">
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
        <p className="flex items-center justify-center text-wrap w-full">
          {query.string ? query.query + " " + query.string : query.query}
        </p>
        <div>
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
      <div
        className={`col-span-2 flex flex-${
          isMobile ? "col" : "row"
        } items-center justify-center`}
      >
        <p>{date}</p>
        <p>{time}</p>
      </div>
      <div
        className={`col-span-${
          isMobile ? "1" : "1/3"
        } flex items-center justify-center`}
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
