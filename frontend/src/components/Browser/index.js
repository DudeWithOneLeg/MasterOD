import { useRef, useEffect, useState } from "react";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
import BrowserHeader from "./BrowserHeader";
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

  useEffect(() => {
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      // !preview.includes("https") &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      setPreview(`https://view.officeapps.live.com/op/embed.aspx?src=${preview}`);
    }
    // if (isIndex) console.log('indexx')
  }, [preview]);

  useEffect(() => {
    setComponent('browser')
    setCopied(false)
  },[preview])

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
      <BrowserHeader preview={preview} component={component} setComponent={setComponent}/>
      {component ? showComponent(component, preview) : <></>}
    </div>
  );
}
