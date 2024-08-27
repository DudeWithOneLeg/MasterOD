import { useRef, useEffect, useState } from "react";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
import BrowserHeader from "./BrowserHeader";
const copyIcon = require('../../assets/images/copy.png')

export default function Browser({
  preview,
  setPreview
}) {
  const domRef = useRef(null);
  const [component, setComponent] = useState('')
  const [config, setConfig] = useState({});
  const [components, setComponents] = useState({
    'browser': (props) => <iframe className="h-full w-full" src={`https://searchdeck.onrender.com:${props.port}/proxy/`+props.url}/>,
    'archive': Archive ,
    'analyze': (props) => <div className="h-[95%] w-full">
    <GptDocAnalyze url={props.url}/>
    </div>
  })

  useEffect(() => {
    // Fetch configuration from backend
    fetch('/config')
      .then((response) => response.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error('Error fetching config:', error));
  }, []);
  const docExtensions = ["ppt", "doc", "docx"];
  useEffect(() => {
  },[])

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
  },[preview])


  const showComponent = (componentName, url, port) => {
    const ComponentToDisplay = components[componentName]
    return <ComponentToDisplay url={url} port={port}/>
  }

  return (
    <div
      className="flex flex-col h-full w-full bg-slate-300 ml-2 p-1 rounded overflow-none"
      // ref={parentRef}
    >
      <BrowserHeader preview={preview} component={component} setComponent={setComponent}/>
      {component ? showComponent(component, preview, config.port) : <></>}
    </div>
  );
}
