import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as searchActions from "../../store/search";
import Results from "../Results";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";

export default function SearchBar() {
  const [query, setQuery] = useState([]);
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showOptions, setShowOptions] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const iframeRef = useRef(null)

  const params = {
    "In title:": "intitle:",
    "In url:": "inurl:",
    "Site:": "site:",
    "Exclude site:": "-site:",
    "Exclude from title:": "-intitle:",
    "Exclude from url:": "-inurl:",
    "Include text:": "intext:",
    "Exclude from text:": "-intext:",
  };
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
      return dispatch(searchActions.search({ query: query.join(" ") }));
    }
  };
  useEffect(() => {
    console.log(showOptions);
  }, [showOptions]);

  return (
    //KEEP CLASS AS IS
    <div
      className={`flex flex-col bg-slate-900 w-full px-2 pt-2`}
      id="search-bar"
    >
      <div
        className={`w-full divide-y divide-slate-800 bg-slate-200 flex flex-col font-bold rounded transition-all duration-300 ease-in-out ${
          showOptions ? `h-fit` : "h-fit"
        }`}
        id="search-bar-inner"
        data-collapse="collapse"
      >
        <div
          className={`w-full flex cursor-pointer text-slate-800 items-center h-fit py-2`}
          data-collapse-target="collapse"
        >
          <div className="flex px-2 items-center max-w-100 h-fit">
            <img
              src="/images/plus.png"
              className="h-10 w-10 flex flex-row"
              onClick={() => setShowOptions(!showOptions)}
            />
            <p>Query</p>
            <div className="flex flex-wrap jusitfy-content-center h-fit max-w-fit overflow-wrap">
              {query.length
                ? query.map((param) => {
                    // const pre = param.split(':')[0]
                    // const val = param.split(':')[1]
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
          {query.length ? (
            <div className="flex justify-self-end px-3" onClick={handleSubmit}>
              <button>Search</button>
            </div>
          ) : (
            ""
          )}
        </div>

        {showOptions &&
          Object.keys(params).map((param) => (
            <Parameter
              query={query}
              setQuery={setQuery}
              text={param}
              param={params[param]}
            />
          ))}
      </div>
      <div className="rounded text-slate-200 h-fit" id="result-header">
        <p>Results</p>
      </div>
      <div className="flex w-full h-fit overflow-y-hidden">
        <Results
          setPreview={setPreview}
          preview={preview}
          showResult={showResult}
          setShowResult={setShowResult}
        />
          {showResult && (
        <div className="truncate h-full w-full flex flex-col bg-slate-300 ml-2 p-1 rounded">
          <p className="w-full truncate h-6">{preview}</p>
            <iframe allow-same-origin={true} ref={iframeRef} src={preview} className="h-full w-full bg-slate-200 p-1"><p>test</p></iframe>
        </div>
          )}
      </div>
    </div>
  );
}
