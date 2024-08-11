import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as searchActions from "../../store/search";
import Iframe from 'react-iframe'

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
      console.log(currUrl)

      if (href.includes(currUrl)) {
        const path = href.split(currUrl)[1];
        // console.log("yo");
        setPreview(preview + path);
        newHistory.push(preview + path);
      } else {
        let nextUrl = ''
        let newPreview = ''
        if (preview.split('/')[preview.split('/').length - 1].includes('?') && preview.split('/')[-1].includes('=')) {
          newPreview = preview.split('/').slice(0, -1).join('/')
          console.log(newPreview)
        }
        else {
          newPreview = preview
        }
        if (href === '/' || href === '../' && newPreview.split('/').length <= 3) {
          nextUrl = newPreview.split('/').slice(0, -2).join('/')
        }
        else if (href[0] !== '/' && preview.split('/').length > 3) {
          nextUrl = newPreview + href
          console.log('hit')
        }
        else {
          nextUrl = newPreview.split('/').slice(0, 3).join('/') + '/' + href
        }
        console.log(nextUrl)
        dispatch(searchActions.fetchResult({ link: nextUrl }));
        setPreview(nextUrl);
        newHistory.push(nextUrl);
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
    // console.log('hit', msOfficeDocs.includes(preview.split(".").slice(-1)[0]))
    if (
      preview &&
      docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes('https') &&
      !preview.includes("https://view.officeapps.live.com/op/embed.aspx?src=")
    ) {
      setPreview(
        `https://docs.google.com/viewer?embedded=true&url=${preview}`
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
    <div className="flex flex-col truncate h-full w-full bg-slate-300 ml-2 p-1 rounded overflow-scroll">
      <div className="bg-slate-400 flex flex-row h-11 items-center w-full">
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
      {/* {!docExtensions.includes(preview.split(".").slice(-1)[0]) &&
      !preview.includes("https") ? (
        <div
          className="w-full overflow-scroll h-full"
          dangerouslySetInnerHTML={{ __html: data }}
          ref={domRef}
          onClick={(e) => handleDomClick(e)}
        />
      ) : ( */}
        {/* <object
          ref={iframeRef}
          data={preview}
          className="flex h-full w-full overflow-scroll"
          type='text/html'
        >
          <embed src={preview} className="w-full h-full"/>
          </object> */}
          <Iframe src={preview} className="h-full w-full"/>
      {/* )} */}
    </div>
  );
}
