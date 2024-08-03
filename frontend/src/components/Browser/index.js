import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as searchActions from "../../store/search";

export default function Browser({
  preview,
  setPreview,
  browseHistory,
  setBrowseHistory,
  browseHistoryIndex,
  setBrowseHistoryIndex,
}) {
  const dispatch = useDispatch();
  const domRef = useRef(null);
  const data = useSelector((state) => state.search.data);
  const iframeRef = useRef(null);

  const docExtensions = ["pdf", "ppt", "doc", "docx"];
  const msOfficeDocs = ["ppt", "doc", "docx"];

  // useEffect(() => {console.log('change')},[browseHistoryIndex])

  //   console.log(preview)

  const handleDomClick = (e) => {
    const newHistory = [...browseHistory];
    // newHistory.push(preview);
    if (e.target.tagName === "A") {
      e.preventDefault();

      const href = e.target.getAttribute("href");
      const currUrl = window.location.href;
      //   console.log("curr:", currUrl);

      if (href.includes(currUrl)) {
        const path = href.split(currUrl)[1];
        // console.log("yo");
        setPreview(preview + path);
        newHistory.push(preview + path);
      } else {
        dispatch(searchActions.fetchResult({ link: preview + href }));
        setPreview(preview + href);
        newHistory.push(preview + href);
      }
      //   console.log(newHistory)
      setBrowseHistory(newHistory);
      setBrowseHistoryIndex(newHistory.length - 1);
    }
  };

  const handleForward = () => {
    const nextIndex = browseHistoryIndex + 1;
    // console.log(nextIndex)
    if (nextIndex < browseHistory.length) {
      setPreview(browseHistory[nextIndex]);
      setBrowseHistoryIndex(nextIndex);
    }
  };

  const handleBack = () => {
    const nextIndex = browseHistoryIndex - 1;

    if (nextIndex > -1) {
      setPreview(browseHistory[nextIndex]);
      setBrowseHistoryIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (
      preview &&
      msOfficeDocs.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      setPreview(
        `https://view.officeapps.live.com/op/embed.aspx?src=${preview}`
      );
    }
  }, [preview]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", (e) => {
        // console.log(e);
      });
    }
  }, [iframeRef]);

  return (
    <div className="flex flex-col truncate h-full w-[90%] bg-slate-300 ml-2 p-1 rounded overflow-scroll">
      <div className="bg-slate-400 flex flex-row h-11 items-center">
        <div className="w-full flex flex-row justify-content-between h-11 p-2">
          <div className="flex flex-row mr-1">
            <img
              src={require("../../assets/icons/arrow_back.png")}
              onClick={() => handleBack()}
              alt='back'
            />
            <img
              src={require("../../assets/icons/arrow_forward.png")}
              onClick={() => handleForward()}
              alt='forward'
            />
          </div>
          <p className="w-full truncate rounded bg-slate-100 p-1">{preview}</p>
        </div>
      </div>
      {!docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes("https") ? (
        <div
          className="w-full overflow-scroll h-full"
          dangerouslySetInnerHTML={{ __html: data }}
          ref={domRef}
          onClick={(e) => handleDomClick(e)}
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={preview}
          className="h-full overflow-scroll"
        />
      )}
    </div>
  );
}
