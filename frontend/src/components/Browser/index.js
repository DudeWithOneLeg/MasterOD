import { useRef, useEffect, useState } from "react";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
import BrowserHeader from "./BrowserHeader";
import { isMobile } from "react-device-detect";
const copyIcon = require('../../assets/images/copy.png')

export default function Browser({
  preview,
  setPreview
}) {
  const [component, setComponent] = useState('')
  const [displayUrl, setdisplayUrl] = useState('')
  const [components, setComponents] = useState({
    'browser': (props) => <iframe className="h-full w-full" src={props.url}/>,
    'archive': Archive ,
    'analyze': (props) => <GptDocAnalyze url={props.url}/>
  })
  const docExtensions = ["ppt", "doc", "docx", "pdf"];
  useEffect(() => {
    setdisplayUrl(preview)
  },[])

  useEffect(() => {
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      // !preview.includes("https") &&
      !preview.includes("https://docs.google.com/viewerng") && !preview.includes('https://docs.google.com/gview?embedded=true&url=')
    ) {
      setPreview(`https://docs.google.com/gview?embedded=true&url=${preview}`);
      setdisplayUrl(preview)
    }
    // if (isIndex) console.log('indexx')
  }, [preview]);

  useEffect(() => {
    setComponent('browser')
  },[preview])


  const showComponent = (componentName, url) => {
    const ComponentToDisplay = components[componentName]
    return <ComponentToDisplay url={url}/>
  }

  return (
    <div
      className={`flex flex-col h-full w-full bg-slate-300 ${isMobile ? '' : 'ml-2'} p-1 rounded overflow-none`}
      // ref={parentRef}
    >
      <BrowserHeader preview={displayUrl} component={component} setComponent={setComponent}/>
      {component ? showComponent(component, preview) : <></>}
    </div>
  );
}
