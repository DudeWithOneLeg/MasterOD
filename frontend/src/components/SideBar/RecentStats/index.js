import { useSelector } from "react-redux";
import {useHistory} from 'react-router-dom'

export default function RecentStats() {
    const history = useHistory()

  const user = useSelector((state) => state.session.user);
  const recentQueries = useSelector((state) => state.search.recentQueries);
  const recentSavedResults = useSelector(
    (state) => state.results.recentSavedResults
  );
  const recentSavedQueries = useSelector(
    (state) => state.search.recentSavedQueries
  );

  const timeFunc = (dateTime) => {
    // date = new Date(date)
    dateTime = new Date(dateTime);
    const currDateTime = new Date(Date.now());
    const timeDifference = currDateTime - dateTime;
    const secondsDifference = timeDifference / 1000;
    const minutesDifference = timeDifference / (1000 * 60);
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (secondsDifference < 60) dateTime = secondsDifference.toFixed(0) + "s ";
    else dateTime = minutesDifference.toFixed(0) + "min ";

    if (minutesDifference > 60) dateTime = hoursDifference.toFixed(0) + "h ";
    if (hoursDifference > 24) dateTime = daysDifference.toFixed(0) + "d ";

    return dateTime.toString();
  };

  const navBarStats = [
    {
      stat: "Saved Queries",
      recent:
      recentSavedQueries && Object.values(recentSavedQueries).length ? (
        Object.values(recentSavedQueries)
        .slice(0, 5)
        .reverse()
        .map((query) => {
          return (
            <div className="flex flex-row text-sm py-1 px-2">
              <p className="pr-1 text-gray-400 w-10">
                {timeFunc(query.createdAt)}
              </p>
              <p className="truncate">{query.query.split(";").join(" ")}</p>
            </div>
          );
        })
      ) : (
          <></>),
      path: "/",
    },
    {
      stat: "Recent Queries",
      recent:
        recentQueries && recentQueries.length ? (
          recentQueries.slice(0, 5).map((query) => {
            return (
              <div className="flex flex-row text-sm py-1 px-2">
                <p className="pr-1 text-gray-400 w-10">
                  {timeFunc(query.createdAt)}
                </p>
                <p className="truncate">{query.query.split(";").join(" ")}</p>
              </div>
            );
          })
        ) : (
            <></>
        //   user.recentQueries && Object.values(user.recentQueries).length ?
        //   Object.values(user.recentQueries).slice(0, 5).map((query) => {
        //     return (
        //       <div className="flex flex-row text-sm py-1 px-2">
        //         <p className="pr-1 text-gray-400">
        //           {timeFunc(query.createdAt)}
        //         </p>
        //         <p className="truncate">{query.query.split(";").join(" ")}</p>
        //       </div>
        //     );
        //   }) : <div className="h-[139.9px]"></div>
        ),
      path: "/queries",
    },
    {
      stat: "Recently Visited",
      recent: <div className="h-[140px]"></div>,
      path: "",
    },
    {
      stat: "Saved Results",
      recent:
        recentSavedResults && Object.values(recentSavedResults).length ? (
          Object.values(recentSavedResults)
            .reverse()
            .map((result) => {
              return (
                <div className="flex flex-row truncate text-sm py-1 px-2">
                  <p className="pr-1 text-gray-400 w-10">
                    {timeFunc(result.createdAt)}
                  </p>
                  <p className="truncate">{result.title}</p>
                </div>
              );
            })
        ) : (
            <></>
        //   user.savedResults && Object.values(user.savedResults).length ?
        //   Object.values(user.savedResults)
        //     .reverse()
        //     .map((result) => {
        //       return (
        //         <div className="flex flex-row truncate text-sm py-1 px-2">
        //           <p className="pr-1 text-gray-400">
        //             {timeFunc(result.createdAt)}
        //           </p>
        //           <p className="truncate">{result.title}</p>
        //         </div>
        //       );
        //     }) : <div className="h-[140px]"></div>
        ),
      path: "",
    },
    // {
    //   stat: "Site History",
    //   recent: <></>,
    // },
  ];

  return (
    Object.values(navBarStats).map((object) => {
        return (
          <div>
            <div onClick={() => history.push(object.path)}>
              <h1 className="p-2 border-b">{object.stat}</h1>
            </div>
            <div className="h-[140px]">{object.recent}</div>
          </div>
        );
      })
  );
}