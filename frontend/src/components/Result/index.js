import { useEffect, useState, useRef } from "react";

export default function Result({
  data,
  rowKey,
  showResult,
  setShowResult,
  setPreview,
}) {
  const [showInfo, setShowInfo] = useState(false);

  const docExtensions = ["pdf", "doc", "docx"];

  const handlClick = () => {
    setShowInfo(!showInfo);
    setShowResult(true);
    setPreview(data[rowKey].link);
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
        <img src="/icons/bookmark.png" />
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
                    {docExtensions.includes(
                      data[rowKey].link.split(".").slice(-1)[0]
                    ) && <img src="images/document.png" className="w-full" />}
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
                  <h3 className="font-bold text-slate-300 text-2xl text-wrap underline w-full">
                    {data[rowKey][columnKey]}
                  </h3>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
