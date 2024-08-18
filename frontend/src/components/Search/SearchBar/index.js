import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as searchActions from '../../../store/search'
import * as resultActions from '../../../store/result'

export default function SearchBar({
  query,
  setQuery,
  country,
  setCountry,
  language,
  setLanguage,
  engine,
  setEngine,
  string,
  setString,
  status,
  setStatus,
  setSearch,
  setTotalPages,
  setVisitedResults,
  setCurrentSelected,
  setLoadingResults,
  setPageNum
}) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const settings = { Google: googleSettings, Bing: bingSettings };

  const saveQuery = () => {
    dispatch(
      searchActions.saveQuery({
        q: query.join(";"),
        cr: country,
        hl: language,
        engine: engine.toLocaleLowerCase(),
        start: 0,
        string: string
      })
    )
  }

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

    if (query || string) {
      setLoadingResults(true)
      setStatus('initial')
      setShowOptions(false);
      console.log(query)
      dispatch(
        resultActions.search({
          q: query.join(";"),
          cr: country,
          hl: language,
          engine: engine.toLocaleLowerCase(),
          start: 0,
          string: string
        }, status = 'initial')
      ).then(async (data) => {
        navigate('/search')
        // const resultsContainer = window.document.querySelector("#inner-result");
        // const bottomPosition = resultsContainer.scrollHeight;
              // resultsContainer.scrollTo(0, 0)
        dispatch(searchActions.getRecentQueries());
        if (data.results && data.results.info && data.results.info.totalPages) {
          setTotalPages(data.results.info.totalPages)
        }
        setLoadingResults(false)
      });
      // console.log(status)
      setSearch(true)
      setStatus('next')
      setVisitedResults([])
      setCurrentSelected(null)
      setPageNum(1)
    }
  };

  return (
    <div
      className={`w-full divide-y divide-slate-500 bg-slate-700 border-2 border-slate-600 flex flex-col font-bold rounded transition-all duration-300 ease-in-out `}
      id="search-bar-inner"
      data-collapse="collapse"
    >
      <div
        className={`w-full flex text-slate-200 items-center h-fit py-2`}
        data-collapse-target="collapse"
      >
        <div className="flex px- items-center w-full h-fit justify-content-between p-2">
          <div className="flex flex-row h-fit items-center">
            <img
              src={require("../../../assets/images/arrow-forward-2.png")}
              className={`h-8 w-8 flex flex-row transition-all duration-300 ease-in-out ${showOptions ? 'rotate-90' : ''} cursor-pointer`}
              onClick={() => setShowOptions(!showOptions)}
              alt='show options'
            />
            <p>Search</p>
            <div className="flex flex-wrap jusitfy-content-center h-fit max-w-fit overflow-wrap">
              <input placeholder="Enter keyword" className="p-1 m-1 bg-slate-600 rounded w-fit outline-none" value={string} onChange={(e) => setString(e.target.value)}/>
              {query && query.length
                ? query.map((param, index) => {
                  if (param.includes(':')) {
                    return (

                      <QueryParam
                        param={param}
                        query={query}
                        setQuery={setQuery}
                        index={index}
                      />

                    );

                  }
                  })
                : ""}
            </div>
          </div>
          <div className="flex flex-row">
            {(query && query.length) || string ? (
              <div
              className="flex flex-row align-items-center"
              >
                <img className="h-8 cursor-pointer" src={require('../../../assets/icons/save.png')} onClick={() => saveQuery()} alt='save query'/>
                <p
                className="px-2 mx-2 rounded h-8 flex align-items-center hover:text-slate-900 cursor-pointer"
                onClick={() => setQuery([])}
                >Clear</p>

              </div>
            ) : (
              <></>
            )}
            <div className="flex align-items-center">

            <label className="h-fit m-0">
              Search Engine:
              <select
                onClick={(e) => setEngine(e.target.value)}
                className="bg-slate-500 rounded ml-1 cursor-pointer"
              >
                <option
                  selected
                  defaultValue="Google"
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
        </div>
        {(query && query.length) || string ? (
          <div className="flex justify-self-end px-3 py-1 mx-1 bg-slate-800 rounded-full hover:bg-slate-600 " onClick={handleSubmit}>
            <button className="focus:outline-none">Search</button>
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
                    selected={settings[engine].countries[name] === country}
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
  );
}
