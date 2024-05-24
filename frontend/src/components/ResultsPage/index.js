import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Results from "../Results";
import Browser from "../Browser";
import * as resultActions from "../../store/result";
import * as searchActions from "../../store/search";

export default function ResultsPage() {
  const dispatch = useDispatch();
  const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  const allResults = useSelector((state) => state.results.allResults);
  const visited = useSelector((state) => state.results.visited);
  const data = useSelector((state) => state.search.data);

  const [preview, setPreview] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({});
  const [browseHistory, setBrowseHistory] = useState([]);
  const [browseHistoryIndex, setBrowseHistoryIndex] = useState(0);
  const [filterInput, setFilterInput] = useState("");
  const [viewAll, setViewAll] = useState(true);

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

  useEffect(() => {
    const {view} = params

    if (view === 'saved') setViewAll(false)
    else if (view === 'all') setViewAll(true)
    else setViewAll(true)
  },[params])

  useEffect(() => {console.log(allResults)},[allResults])

  return (
    <div className="flex flex-col h-full w-full p-2">
      <div className="flex items-center justify-content-center w-full my-2">
          <input className="w-1/2 rounded-full h-8 px-3 text-black" placeholder='Filter searches' value={filterInput} onChange={(e) => setFilterInput(e.target.value)}/>
        </div>
        <div className="flex w-full justify-content-center">
          <div className="flex flex-row w-fit rounded bg-slate-500">
            <p
              onClick={() => setViewAll(true)}
              className={`px-1 cursor-pointer ${viewAll ? "border-b-4" : ""}`}
            >
              All
            </p>
            <p
              onClick={() => setViewAll(false)}
              className={`ml-1 px-1 cursor-pointer ${
                viewAll ? "" : "border-b-4"
              }`}
            >
              Saved
            </p>
          </div>
        </div>
      <div className="flex w-full h-full overflow-y-hidden">
        {allResults && !viewAll ? (
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
        {visited && viewAll ? (
          <><Results
          setPreview={setPreview}
              preview={preview}
              showResult={showResult}
              setShowResult={setShowResult}
              setResult={setResult}
              infiniteScroll={false}
              data={visited}
          /></>
        ): <></>}
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
