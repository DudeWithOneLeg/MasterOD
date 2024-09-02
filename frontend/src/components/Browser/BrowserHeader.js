import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
const copyIcon = require('../../assets/images/copy.png')

export default function BrowserHeader({preview, component, setComponent}) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setCopied(false)
    },[])

      const copyToClipboard = () => {
        if (preview.includes('https://docs.google.com/gview?embedded=true&url=')) {
          navigator.clipboard.writeText(preview.split('https://docs.google.com/gview?embedded=true&url=')[1])

        }
        else {
          navigator.clipboard.writeText(preview)
        }
        setCopied(true)
      };
      useEffect(() => {
        setComponent('browser')
        setCopied(false)
      },[preview])
  return (
    <div className={`flex h-[${isMobile ? '10' : '5'}%]`}>
      <div className="fixed -mt-6 flex flex-row text-white pb-1">
        <div
          className={`bg-slate-${
            component === "browser" ? "400" : "600 hover:bg-slate-400"
          } rounded-t mx-1 px-1 cursor-pointer rounded-b-none`}
          onClick={() => setComponent("browser")}
        >
          Browser
        </div>
        <div
          className={`bg-slate-${
            component === "archive" ? "400" : "600 hover:bg-slate-400"
          } rounded-t mx-1 px-1 cursor-pointer rounded-b-none`}
          onClick={() => setComponent("archive")}
        >
          Archive
        </div>
        {preview.split(".").slice(-1)[0].toLowerCase() === "pdf" ? (
          <div
            className={`bg-slate-${
              component === "analyze" ? "400" : "600 hover:bg-slate-400"
            } rounded-t mx-1 px-1 cursor-pointer rounded-b-none`}
            onClick={() => setComponent("analyze")}
          >
            Analyze w/ GPT-4
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={`bg-slate-400 flex flex-row items-center justify-content-between w-full p-${isMobile ? '1 text-sm' : '2'} h-fit overflow-hidden`}>
        <div className="w-full flex flex-row justify-content-between h-fit bg-slate-100 p-1 rounded overflow-hidden">
          <input className="w-full rounded overflow-scroll no-scrollbar" value={preview} disabled/>
          {copied ? (
            <p>Copied!</p>
          ) : (
            <img
              alt="copy url"
              className="cursor-pointer h-6"
              src={copyIcon}
              onClick={copyToClipboard}
            />
          )}
        </div>
      </div>
    </div>
  );
}
