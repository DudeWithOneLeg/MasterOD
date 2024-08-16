import { useState } from "react";
import { useSelector } from "react-redux";
import SaveResult from "../SaveResult";
const newTab = require("../../assets/icons/open_in_new.png");

export default function Result({
  data,
  rowKey,
  setShowResult,
  setPreview,
  setResult,
  setWidth,
  currentSelected,
  setCurrentSelected,
  visitedResults,
  setVisitedResults
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSearchId = useSelector(
    (state) => Object.values(state.search.recentQueries)[0].id
  );

  const docExtensions = ["pdf", "doc", "docx"];
  const result = data[rowKey];

  const handleClick = () => {
    const newResult = { ...data[rowKey] };
    newResult.queryId = lastSearchId;
    setShowInfo(!showInfo);
    setShowResult(true);
    setResult(newResult);
    setPreview(data[rowKey].link);
    setWidth('w-full')
    return;
  };

  const handleNewTab = () => {
    const link = data[rowKey].link;
    window.open(link, '_blank');
    return
  }

  // console.log(result)

  return (
    <div
      key={rowKey}
      data-collapse-target="collapse"
      data-collapse="collapse"
      id="result"
      onClick={() => {
        setCurrentSelected(result.id)
        setVisitedResults([...visitedResults, result.id])
      }}
      className={`${currentSelected === result.id ? 'border-4 border-green-200': (visitedResults?.includes(result.id) && currentSelected != result.id ? 'border-2 border-white' : '')} h-fit w-full cursor-pointer flex items-center rounded bg-gradient-to-r from-slate-800 via-slate-800 hover:bg-gradient-to-r hover:from-slate-700 hover:via-slate-800 py-2 mb-2 mr-1 transition-all duration-300 ease-in-out `}
    >
      <div className="flex flex-col items-center justify-content-around min-w-10 h-full">
        {/* <div className="text-white">{result.id}</div> */}
        <SaveResult result={result} saved={saved} setSaved={setSaved} />
        {result.title && result.title.toLowerCase().includes("index of /") ? (
          <div className="rounded bg-green-200  w-6">Idx</div>
        ) : (
          <></>
        )}
        <div className="flex font-bold h-fit w-fit bg-slate-300 rounded"></div>
      </div>
      <div
        onClick={handleClick}
        className="flex flex-col items-start h-full w-full"
      >
        {result ? (
          <div key={result.id} className={`flex flex-col text-slate-400 h-fit w-full`}>
            <div className="flex flex-row ">
              <div className="w-full">
                <div className="flex flex-row justify-content-between w-full">
                  <h3 className="font-bold text-slate-300 text-xl text-wrap underline w-fit">
                    {result.title && result.title}
                  </h3>
                  <img src={newTab} className="h-8" onClick={handleNewTab} alt='new tab'/>
                </div>
                <p className="text-sm truncate w-3/4">{result.link.split('').slice(0, 50).join('')}...</p>
              </div>

              {result.link &&
                docExtensions.includes(result.link.split(".").slice(-1)[0]) && (
                  <img
                    src={require("../../assets/images/document.png")}
                    className="w-8 h-8"
                    alt='document'
                  />
                )}
            </div>
            <div>
              <p className="underline w-fit">{result.snippet}</p>
            </div>

            {result.archive &&
              result.archive.archived_snapshots &&
              result?.archive?.archived_snapshots?.closest?.url && (
                <a
                  href={result.archive.archived_snapshots.closest.url}
                  target="_blank"
                  className="font-bold text-slate-400 w-fit"
                  rel="noreferrer"
                >
                  Archive
                </a>
              )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
