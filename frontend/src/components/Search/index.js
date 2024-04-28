import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as searchActions from "../../store/search";
import * as sessionActions from "../../store/session";
import Results from "../Results";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import Browser from "../Browser";

export default function Search() {
  const [query, setQuery] = useState([]);
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showOptions, setShowOptions] = useState(false);
  const [preview, setPreview] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [engine, setEngine] = useState("Google");
  const data = useSelector((state) => state.search.data);
  const results = useSelector((state) => state.search.results);
  const [start, setStart] = useState(0);
  const [browseHistory, setBrowseHistory] = useState([]);
  const [browseHistoryIndex, setBrowseHistoryIndex] = useState(0);
  const docExtensions = ["pdf", "ppt", "doc", "docx"];

  const settings = { Google: googleSettings, Bing: bingSettings };

  const dispatch = useDispatch();

  const handleSubmit = () => {
    // e.preventDefault()

    // const { lat, lng } = geolocation;
    // const today = new Date();
    // const hours = today.getHours();
    // const minutes = today.getMinutes();
    // hours >= 12 ? console.log("PM") : console.log("AM");
    // console.log(today);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(success, error);
    // } else {
    //   console.log("Geolocation not supported");
    // }

    // function success(position) {
    //   const latitude = position.coords.latitude;
    //   const longitude = position.coords.longitude;
    //   setGeolocation({ lat: latitude, lng: longitude });
    //   // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    //   // setGe
    // }

    // function error() {
    //   console.log("Unable to retrieve your location");
    // }

    if (query) {
      setShowOptions(false);
      dispatch(
        searchActions.search({
          q: query.join(";"),
          cr: country,
          hl: language,
          engine: engine.toLocaleLowerCase(),
          start: 0,
        })
      ).then(async () => {
        dispatch(
          sessionActions.newQuery({
            q: query.join(";"),
            cr: country,
            hl: language,
            engine: engine.toLocaleLowerCase(),
            start: 0,
          })
        );
      });
    }
  };

  //Only fetch data if link is a page, not a file
  useEffect(() => {
    if (preview && !docExtensions.includes(preview.split(".").slice(-1)[0])) {
      dispatch(searchActions.data(preview));
      if (!browseHistory.length) {
        setBrowseHistory([preview]);
      }
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
      <div
        className={`w-full divide-y divide-slate-500 bg-slate-700 border-2 border-slate-600 flex flex-col font-bold rounded transition-all duration-300 ease-in-out ${
          showOptions ? `h-fit` : "h-fit"
        }`}
        id="search-bar-inner"
        data-collapse="collapse"
      >
        <div
          className={`w-full flex cursor-pointer text-slate-200 items-center h-10 py-2`}
          data-collapse-target="collapse"
        >
          <div className="flex px- items-center w-full h-fit justify-content-between p-2">
            <div className="flex flex-row items-center">
              <img
                src="/images/plus.png"
                className="h-10 w-10 flex flex-row"
                onClick={() => setShowOptions(!showOptions)}
              />
              <p>Query</p>
              <div className="flex flex-wrap jusitfy-content-center h-fit max-w-fit overflow-wrap">
                {query.length
                  ? query.map((param) => {
                      return (
                        <QueryParam
                          param={param}
                          query={query}
                          setQuery={setQuery}
                        />
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className="flex flex-row">
              {query.length ? (
                <div
                  className="px-2 mx-2 border rounded"
                  onClick={() => setQuery([])}
                >
                  Clear
                </div>
              ) : (
                <></>
              )}
              <label className="h-fit m-0">
                Search Engine:
                <select
                  onClick={(e) => setEngine(e.target.value)}
                  className="bg-slate-500 rounded ml-1"
                >
                  <option
                    selected
                    value={"Google"}
                    onClick={() => setEngine("Google")}
                  >
                    Google
                  </option>
                  {/* <option value={"Baidu"}>Baidu</option> */}
                  <option value={"Bing"} onClick={() => setEngine("Bing")}>
                    Bing
                  </option>
                  {/* <option value={"Yandex"}>Yandex</option> */}
                </select>
              </label>
            </div>
          </div>
          {query.length ? (
            <div className="flex justify-self-end px-3" onClick={handleSubmit}>
              <button>Search</button>
            </div>
          ) : (
            ""
          )}
        </div>
        {showOptions && (
          <div className="flex flex-row bg-slate-600 border-2 rounded">
            <div className="divide-y divide-slate-500 w-1/3">
              {Object.keys(settings[engine].operators).map((param) => (
                <Parameter
                  query={query}
                  setQuery={setQuery}
                  text={param}
                  param={settings[engine].operators[param]}
                />
              ))}
            </div>
            <div className="w-1/3 h-full divide-y divide-slate-500">
              {(engine === "Google" || engine === "Bing") && (
                <div className="p-2">
                  <select
                    // id="normalize"
                    className="pl-2"
                    onClick={(e) =>
                      setLanguage(settings[engine].languages[e.target.value])
                    }
                  >
                    <option selected={country === ""} disabled>
                      Language
                    </option>

                    {Object.keys(settings[engine].languages).map((name) => (
                      <option
                        selected={settings[engine].languages[name] === language}
                        value={name}
                      >
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-2">
                <select
                  // id="normalize"
                  className="pl-2"
                  onClick={(e) =>
                    setCountry(settings[engine].countries[e.target.value])
                  }
                >
                  <option selected={country === ""} disabled className="">
                    Country
                  </option>

                  {Object.keys(settings[engine].countries).map((name) => (
                    <option
                      value={name}
                      selected={settings[engine].countries[name] == country}
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {results ? (
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
                / <p>{results.info.totalPages}</p>
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
              }}
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
        <></>
      )}
    </div>
  );
}
