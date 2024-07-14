import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as searchActions from "../../store/search";
import * as resultActions from '../../store/result'
import Results from "../Results";
import Browser from "../Browser";
import SearchBar from "./SearchBar";
import QueryStats from '../QueryStats'


export default function Search({search, setSearch}) {
  const data = useSelector((state) => state.search.data);
  const results = useSelector((state) => state.results.results);

  const [query, setQuery] = useState([]);
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [preview, setPreview] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [engine, setEngine] = useState("Google");
  const [start, setStart] = useState(0);
  const [browseHistory, setBrowseHistory] = useState([]);
  const [browseHistoryIndex, setBrowseHistoryIndex] = useState(0);
  const [result, setResult] = useState({});
  const [keywords, setKeywords] = useState("test")
  const [status, setStatus] = useState('');


  const docExtensions = ["pdf", "ppt", "doc", "docx"];

  const dispatch = useDispatch();

  //Only fetch data if link is not a file
  useEffect(() => {
    if (preview && !docExtensions.includes(preview.split(".").slice(-1)[0])) {
      dispatch(searchActions.fetchResult(result));
      if (!browseHistory.length) {
        setBrowseHistory([preview]);
      }

    dispatch(resultActions.getRecentVisitedResults())
    }
  }, [preview, dispatch]);

  //Grab index of the last result to start next load
  useEffect(() => {
    if (results) {
      const lastResultIndex = Number(Object.keys(results).slice(-2, -1)[0]);
      setStart(lastResultIndex);
    }
  }, [results]);

  return (
    //KEEP CLASS AS IS
    <div
      className={`flex flex-col bg-slate-900 w-full px-2 pt-2`}
      id="search-bar"
    >
      <SearchBar
        query={query}
        setQuery={setQuery}
        language={language}
        setLanguage={setLanguage}
        country={country}
        setCountry={setCountry}
        engine={engine}
        setEngine={setEngine}
        keywords={keywords}
        setKeywords={setKeywords}
        status={status}
        setStatus={setStatus}
        setSearch={setSearch}
      />

      {results && search ? (
        <>
          <div className="rounded text-slate-200 h-fit" id="result-header">
            <div
              className={`flex justify-content-center py-2 ${
                showResult ? "w-1/2" : ""
              }`}
            >
              <div className="flex flex-row w-fit">
                <input
                  placeholder={results.info.currentPage}
                  className="w-10 rounded text-center text-slate-600"
                />{" "}
                / <p>{results.info.totalPages != NaN ? results.info.totalPages : ''}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full h-screen overflow-y-hidden">
            <Results
              setPreview={setPreview}
              preview={preview}
              showResult={showResult}
              setShowResult={setShowResult}
              start={start}
              setStart={setStart}
              params={{
                q: query.join(";"),
                cr: country,
                hl: language,
                engine: engine.toLocaleLowerCase(),
                keywords
              }}
              setResult={setResult}
              data={results}
              infiniteScroll={true}
              status={status}
              setStatus={setStatus}
            />
            {((showResult && data) || (showResult && preview)) && (
              <Browser
                preview={preview}
                data={data}
                setPreview={setPreview}
                browseHistory={browseHistory}
                setBrowseHistory={setBrowseHistory}
                browseHistoryIndex={browseHistoryIndex}
                setBrowseHistoryIndex={setBrowseHistoryIndex}
              />
            )}
          </div>
        </>
      ) : (
        <div className="h-full overflow-hidden py-2">
          <QueryStats />
        </div>
      )}
    </div>
  );
}
