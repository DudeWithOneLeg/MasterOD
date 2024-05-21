import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as resultActions from "../../store/result";

export default function Result({
  data,
  rowKey,
  showResult,
  setShowResult,
  setPreview,
  setResult,
}) {
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSearchId = useSelector(
    (state) => Object.values(state.search.recentQueries)[0].id
  );

  const docExtensions = ["pdf", "doc", "docx"];
  const result = data[rowKey];

  const handlClick = () => {
    const newResult = { ...data[rowKey] };
    newResult.queryId = lastSearchId;
    setShowInfo(!showInfo);
    setShowResult(true);
    setResult(newResult);
    setPreview(data[rowKey].link);
  };

  const saveResult = () => {
    const newResult = {
      title: result.title,
      snippet: result.snippet,
      link: result.link,
      queryId: lastSearchId,
    };

    dispatch(resultActions.postSavedResult(newResult));
    setSaved(true);
  };

  return (
    <div
      key={rowKey}
      data-collapse-target="collapse"
      data-collapse="collapse"
      id="result"
      className={`h-fit cursor-pointer border-secondary flex w-full items-center rounded border py-2 mb-2 mr-1 transition-all duration-300 ease-in-out `}
    >
      <div className=""></div>
      <div className="flex flex-col items-center justify-content-around min-w-10 h-full">
        {saved ? (
          <img src={require("../../assets/icons/bookmark_FILL.png")} />
        ) : (
          <img onClick={saveResult} src={require("../../assets/icons/bookmark.png")} />
        )}
        <div className="flex font-bold h-fit w-fit bg-slate-300 rounded"></div>
      </div>
      <div
        onClick={handlClick}
        className="flex flex-col items-start h-full w-full"
      >
        {result && (
          <div key={result.id} className={`flex flex-col text-slate-400 h-fit`}>
            <div className="flex flex-row ">
              <div>
                <h3 className="font-bold text-slate-300 text-2xl text-wrap underline w-full">
                {result.title}
              </h3>
              <p className="text-sm">{result.link}</p>
              </div>


              {result.link && docExtensions.includes(result.link.split(".").slice(-1)[0]) && (
                <img src="images/document.png" className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className={"underline"}>{result.snippet}</p>
            </div>

            { result.archive && result.archive.archived_snapshots && result?.archive?.archived_snapshots?.closest?.url && <a
              href={result.archive.archived_snapshots.closest.url}
              target="_blank"
              className="font-bold text-slate-400"
            >
              Archive
            </a>}
          </div>
        )}
      </div>
    </div>
  );
}
