import { useRef, useEffect, useState } from "react";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
import { io } from "socket.io-client";
const copyIcon = require('../../assets/images/copy.png')

export default function Browser({
  preview,
}) {
  const domRef = useRef(null);
  const [showArchive, setShowArchive] = useState(true);

  const docExtensions = ["pdf", "ppt", "doc", "docx"];
  const msOfficeDocs = ["ppt", "doc", "docx"];

  useEffect(() => {
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes("https") &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      // setPreview(`https://docs.google.com/viewer?embedded=true&url=${preview}`);
    }
    setShowArchive(true)
  }, [preview]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(preview)
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-slate-300 ml-2 p-1 rounded overflow-none"
      // ref={parentRef}
    >
      {/* <div className="fixed -mt-6 flex flex-row text-white pb-1">
        <div
          className={`bg-slate-${!showArchive ? '400' : '600 hover:bg-slate-400'} rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setShowArchive(false)}
        >
          Browser
        </div>
        <div
          className={`bg-slate-${showArchive ? '400' : '600 hover:bg-slate-400'} rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setShowArchive(true)}
        >
          Archive
        </div>
      </div> */}
      <div className="bg-slate-400 flex flex-row items-center justify-content-between w-full p-2 h-[5%]">
        <div className="w-full flex flex-row justify-content-between h-8 bg-slate-100 p-1 rounded">
          <p className="w-full truncate rounded">{preview}</p>
          <img alt='copy url' className='cursor-pointer' src={copyIcon} onClick={copyToClipboard}/>
        </div>
      </div>

      {!showArchive ? (
        <iframe
          src={`${preview}`}
          className="h-full w-full"
          ref={domRef}
        ></iframe>
      ) : (
        <Archive url={preview}/>
      )}
      {/* {showArchive && preview ?
      <div className="h-[95%] w-full">
      <GptDocAnalyze url={preview}/>
      </div>: <></>} */}
    </div>
  );
}
