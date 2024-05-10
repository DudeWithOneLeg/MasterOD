import { useState } from "react";
import { useDispatch } from "react-redux";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as sessionActions from "../../../store/session";
import * as searchActions from '../../../store/search'

export default function SearchBar({query, setQuery, country, setCountry, language, setLanguage, engine, setEngine}) {
  const [showOptions, setShowOptions] = useState(false);
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

  return (
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
              <input defaultValue="Enter keyword" className="px-2 m-1 bg-slate-600 rounded w-fit outline-none"/>
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
              className="flex flex-row align-items-center"
              >
                <img className="h-10 pointer" src='/icons/save.png' onClick={() => saveQuery()}/>
                <p
                className="px-2 mx-2 border rounded h-8 flex align-items-center hover:bg-red-600 bg-red-900"
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
                className="bg-slate-500 rounded ml-1"
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
  );
}
