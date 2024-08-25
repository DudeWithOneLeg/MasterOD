import { useState, useEffect } from "react";
const copyIcon = require('../../assets/images/copy.png')

export default function BrowserHeader({preview, component, setComponent}) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setCopied(false)
    },[])

      const copyToClipboard = () => {
        navigator.clipboard.writeText(preview)
        setCopied(true)
      };
      useEffect(() => {
        setComponent('browser')
        setCopied(false)
      },[preview])
  return (
    <>
      <div className="fixed -mt-6 flex flex-row text-white pb-1">
        <div
          className={`bg-slate-${
            component === "browser" ? "400" : "600 hover:bg-slate-400"
          } rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setComponent("browser")}
        >
          Browser
        </div>
        <div
          className={`bg-slate-${
            component === "archive" ? "400" : "600 hover:bg-slate-400"
          } rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setComponent("archive")}
        >
          Archive
        </div>
        {/* {preview.split(".").slice(-1)[0].toLowerCase() === "pdf" ? (
          <div
            className={`bg-slate-${
              component === "analyze" ? "400" : "600 hover:bg-slate-400"
            } rounded mx-1 px-1 cursor-pointer`}
            onClick={() => setComponent("analyze")}
          >
            Analyze with ChatGPT
          </div>
        ) : (
          <></>
        )} */}
      </div>
      <div className="bg-slate-400 flex flex-row items-center justify-content-between w-full p-2 h-[5%] overflow-hidden">
        <div className="w-full flex flex-row justify-content-between h-8 bg-slate-100 p-1 rounded overflow-hidden">
          <p className="w-full truncate rounded overflow-hidden">
            {preview.split("").slice(0, 70).join("")}...
          </p>
          {copied ? (
            <p>Copied!</p>
          ) : (
            <img
              alt="copy url"
              className="cursor-pointer"
              src={copyIcon}
              onClick={copyToClipboard}
            />
          )}
        </div>
      </div>
    </>
  );
}
