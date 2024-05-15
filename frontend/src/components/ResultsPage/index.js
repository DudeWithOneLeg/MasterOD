import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Results from "../Results";
import * as resultActions from "../../store/result";
import * as searchActions from "../../store/search";

export default function ResultsPage() {
  const dispatch = useDispatch();
  const allResults = useSelector((state) => state.results.allResults);
  const visited = useSelector((state) => state.results.visited);
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
    <div>
      {allResults ? (
        <Results
          setPreview={setPreview}
          preview={preview}
          showResult={showResult}
          setShowResult={setShowResult}
          setResult={setResult}
          infiniteScroll={false}
          data={allResults}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
