import { useContext, useEffect, useState } from "react";
import { ResultsContext } from "../../context/ResultsContext";
import GptDocAnalyze from "../GptDocAnalyze/GptDocAnalyze";
import Archive from "../Archive/archive";
import BrowserHeader from "./BrowserHeader";
import { isMobile } from "react-device-detect";

export default function Browser() {
    const { preview, setPreview } = useContext(ResultsContext);
    const [component, setComponent] = useState("");
    const [displayUrl, setdisplayUrl] = useState("");
    const [components, setComponents] = useState({
        browser: (props) => (
            <iframe className="h-full w-full" src={props.url} />
        ),
        archive: (props) => <Archive url={props.url} />,
        analyze: (props) => (
            <GptDocAnalyze
                url={
                    props.url.includes(
                        "https://docs.google.com/gview?embedded=true&url="
                    )
                        ? props.url.split(
                              "https://docs.google.com/gview?embedded=true&url="
                          )[1]
                        : props.url
                }
            />
        ),
    });
    const docExtensions = ["ppt", "doc", "docx", "pdf"];

    useEffect(() => {
        if (
            preview &&
            docExtensions.includes(preview.split(".").slice(-1)[0]) &&
            // !preview.includes("https") &&
            !preview.includes("https://docs.google.com/viewerng") &&
            !preview.includes(
                "https://docs.google.com/gview?embedded=true&url="
            )
        ) {
            setPreview(
                `https://docs.google.com/gview?embedded=true&url=${preview}`
            );
            setdisplayUrl(preview);
        }
    }, [preview]);

    useEffect(() => {
        setComponent("browser");
        setdisplayUrl(preview);
    }, [preview]);

    const showComponent = (componentName, url) => {
        const ComponentToDisplay = components[componentName];
        return <ComponentToDisplay url={url} />;
    };

    return (
        <div
            className={`flex flex-col h-full w-full bg-zinc-700 ${
                isMobile ? "" : "ml-2"
            } p-1 rounded overflow-hidden`}
            // ref={parentRef}
        >
            <BrowserHeader
                preview={displayUrl}
                component={component}
                setComponent={setComponent}
            />
            {component ? showComponent(component, preview) : <></>}
        </div>
    );
}
