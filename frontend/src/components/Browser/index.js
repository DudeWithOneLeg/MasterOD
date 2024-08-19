import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as searchActions from "../../store/search";
import Archive from "../Archive/archive";

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
  const [showArchive, setShowArchive] = useState(false);

  const docExtensions = ["pdf", "ppt", "doc", "docx"];
  const msOfficeDocs = ["ppt", "doc", "docx"];

  // useEffect(() => {console.log('change')},[browseHistoryIndex])

  //   console.log(preview)

  useEffect(() => {
    // console.log('hit', msOfficeDocs.includes(preview.split(".").slice(-1)[0]))
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes("https") &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      setPreview(`https://docs.google.com/viewer?embedded=true&url=${preview}`);
    }
  }, [preview]);

  // useEffect(() => {
  //   if (iframeRef.current) {
  //     iframeRef.current.addEventListener("load", (e) => {
  //       // console.log(e);
  //     });
  //   }
  // }, [iframeRef]);

  // useEffect(() => {
  //   if (domRef.current) {
  //     const iframe = domRef.current;
  //     domRef.current.onload = (e) => {
  //       console.log(iframe.contentWindow.history);
  //     };
  //   }
  // }, [domRef]);

  // useEffect(() => {
  //   if (domRef.current && parentRef.current) {
  //     parentRef.current.addEventListener(
  //       "message",
  //       (event) => {
  //         if (event.origin === "http://the-iframe-origin.com") {
  //           console.log("Iframe URL:", event.data);
  //           // Update UI or perform actions based on the received URL
  //         }
  //       },
  //       false
  //     );

  //     window.parent.postMessage(window.location.href, 'http://your-parent-origin.com');
  //   }
  // }, []);

  // useEffect(() => {
  //   if (domRef.current) {
  //     console.log(divRef.current.location)
  //   }
  // },[domRef.current])

  const showArchivebutton = () => {
    setShowArchive(true);
  };

  return (
    <div
      className="flex flex-col truncate h-full w-full bg-slate-300 ml-2 p-1 rounded overflow-scroll"
      // ref={parentRef}
    >
      <div className="fixed -mt-6 flex flex-row text-white">
        <div
          className={`bg-slate-${!showArchive ? '400' : '600'} rounded mx-1 px-1`}
          onClick={() => setShowArchive(false)}
        >
          Browser
        </div>
        <div
          className={`bg-slate-${showArchive ? '400' : '600'} rounded mx-1 px-1`}
          onClick={() => setShowArchive(true)}
        >
          Archive
        </div>
      </div>
      <div className="bg-slate-400 flex flex-row h-11 items-center w-full">
        <div className="w-full flex flex-row justify-content-between h-11 p-2">
          <p className="w-full truncate rounded bg-slate-100 p-1">{preview}</p>
        </div>
      </div>

      {!showArchive ? (
        <iframe
          src={`https://web.archive.org/web/20090000000000/${preview}`}
          className="h-full w-full"
          ref={domRef}
        ></iframe>
      ) : (
        <Archive />
      )}
    </div>
  );
}
