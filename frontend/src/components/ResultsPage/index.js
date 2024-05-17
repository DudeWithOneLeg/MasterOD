import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Results from "../Results";
import Browser from "../Browser";
import * as resultActions from "../../store/result";
import * as searchActions from "../../store/search";

export default function ResultsPage() {
  const dispatch = useDispatch();
  const allResults = useSelector((state) => state.results.allResults);
  const visited = useSelector((state) => state.results.visited);
  const data = useSelector((state) => state.search.data);

  const [preview, setPreview] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({});
  const [browseHistory, setBrowseHistory] = useState([]);
  const [browseHistoryIndex, setBrowseHistoryIndex] = useState(0);

  const docExtensions = ["pdf", "ppt", "doc", "docx"];

  useEffect(() => {
    dispatch(resultActions.getallResults());
  }, [dispatch]);

  useEffect(() => {
    if (preview && !docExtensions.includes(preview.split(".").slice(-1)[0])) {
      dispatch(searchActions.fetchResult(result));
      if (!browseHistory.length) {
        setBrowseHistory([preview]);
      }
    }
  }, [preview, dispatch]);

  return (
    <div className="flex flex-col h-full w-full p-2">
        <div className="flex flex-row">
            <p>Saved</p>
            <p>History</p>
        </div>
      <div className="flex w-full h-full overflow-y-hidden">
        {allResults ? (
          <>
            <Results
              setPreview={setPreview}
              preview={preview}
              showResult={showResult}
              setShowResult={setShowResult}
              setResult={setResult}
              infiniteScroll={false}
              data={allResults}
            />
          </>
        ) : (
          <></>
        )}
        {(showResult && data) || (showResult && preview) ? (
          <Browser
            preview={preview}
            data={data}
            setPreview={setPreview}
            browseHistory={browseHistory}
            setBrowseHistory={setBrowseHistory}
            browseHistoryIndex={browseHistoryIndex}
            setBrowseHistoryIndex={setBrowseHistoryIndex}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
