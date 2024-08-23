import { useRef, useEffect, useState } from "react";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
const copyIcon = require('../../assets/images/copy.png')

export default function Browser({
  preview,
  setPreview,
  isIndex
}) {
  const domRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [component, setComponent] = useState('')
  const docExtensions = ["ppt", "doc", "docx"];
  const msOfficeDocs = ["ppt", "doc", "docx"];

  useEffect(() => {
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      // !preview.includes("https") &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      setPreview(`https://view.officeapps.live.com/op/embed.aspx?src=${preview}`);
    }
    if (isIndex) console.log('indexx')
  }, [preview]);

  useEffect(() => {
    setComponent('browser')
    setCopied(false)
  },[])

  const components = {
    'browser': (props) => <iframe className="h-full w-full" ref={domRef} src={props.url}/>,
    'archive': Archive ,
    'analyze': (props) => <div className="h-[95%] w-full">
    <GptDocAnalyze url={props.url}/>
    </div>
  }

  const showComponent = (componentName, url) => {
    const ComponentToDisplay = components[componentName]
    return <ComponentToDisplay url={url}/>
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(preview)
    setCopied(true)
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-slate-300 ml-2 p-1 rounded overflow-none"
      // ref={parentRef}
    >
      <div className="fixed -mt-6 flex flex-row text-white pb-1">
        <div
          className={`bg-slate-${component === 'browser' ? '400' : '600 hover:bg-slate-400'} rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setComponent('browser')}
        >
          Browser
        </div>
        <div
          className={`bg-slate-${component === 'archive' ? '400' : '600 hover:bg-slate-400'} rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setComponent('archive')}
        >
          Archive
        </div>
        {/* {preview.split('.').slice(-1)[0].toLowerCase() === 'pdf' ? <div
          className={`bg-slate-${component === 'analyze' ? '400' : '600 hover:bg-slate-400'} rounded mx-1 px-1 cursor-pointer`}
          onClick={() => setComponent('analyze')}
        >
          Analyze with ChatGPT
        </div> : <></>} */}
      </div>
      <div className="bg-slate-400 flex flex-row items-center justify-content-between w-full p-2 h-[5%]">
        <div className="w-full flex flex-row justify-content-between h-8 bg-slate-100 p-1 rounded">
          <p className="w-full truncate rounded">{preview}</p>
          {copied ? <p>Copied!</p> : <img alt='copy url' className='cursor-pointer' src={copyIcon} onClick={copyToClipboard}/>}
        </div>
      </div>
      {component ? showComponent(component, preview) : <></>}
    </div>
  );
}
