import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as resultActions from '../../store/result'


export default function Result({
  data,
  rowKey,
  showResult,
  setShowResult,
  setPreview,
}) {
  const dispatch = useDispatch()
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSearchId = useSelector(state => Object.values(state.search.recentQueries)[0].id)

  const docExtensions = ["pdf", "doc", "docx"];

  const handlClick = () => {
    setShowInfo(!showInfo);
    setShowResult(true);
    setPreview(data[rowKey].link);
  };

  const saveResult = () => {
    const result = data[rowKey]
    const newResult = {
      title: result.title,
      description: result.snippet,
      url: result.link,
      queryId: lastSearchId
    }

    dispatch(resultActions.postSavedResult(newResult))
    setSaved(true)
  }

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
        {saved ? <img src='/icons/bookmark_FILL.png'/> : <img
        onClick={saveResult}
        src="/icons/bookmark.png" />}
        <div className="flex font-bold h-fit w-fit bg-slate-300 rounded"></div>
      </div>
      <div
        onClick={handlClick}
        className="flex flex-col items-start h-full w-full"
      >
        {data[rowKey] &&
          Object.keys(data[rowKey])
            .slice(1)
            .map((columnKey) => (
              <div
                key={columnKey}
                className={`flex flex-col text-slate-400 h-fit`}
              >
                {!data[rowKey][columnKey]?.url && columnKey != "title" ? (
                  // <div className="flex flex-wrap h-fit">
                  <div>
                    <p
                      className={
                        columnKey == "link"
                          ? "text-sm text-slate-300 flex w-full"
                          : "underline"
                      }
                    >
                      {data[rowKey][columnKey]}
                    </p>

                  </div>
                ) : //</div>
                data[rowKey][columnKey].archived_snapshots ? (
                  <a
                    href={
                      data[rowKey][columnKey].archived_snapshots.closest?.url
                    }
                    target="_blank"
                    className="font-bold text-slate-400"
                  >
                    Archive
                  </a>
                ) : (
                  <div className="flex flex-row ">

                  <h3 className="font-bold text-slate-300 text-2xl text-wrap underline w-full">
                    {data[rowKey][columnKey]}
                  </h3>
                  {docExtensions.includes(
                      data[rowKey].link.split(".").slice(-1)[0]
                    ) && <img src="images/document.png" className="w-8 h-8" />}
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
