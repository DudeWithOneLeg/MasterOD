import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../../context/SearchContext";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as searchActions from "../../../store/search";
import * as resultActions from "../../../store/result";
const clearText = require("../../../assets/images/clear.png");
const searchIcon = require("../../../assets/images/search.png");

export default function SearchBar({
    setPageNum,
    showOptions,
    setShowOptions,
    setStatus,
    status,
    setTotalPages
}) {
    const {
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
        setSearch,
        setVisitedResults,
        setCurrentSelected,
        setLoadingResults,

    } = useContext(SearchContext)
    const navigate = useNavigate();
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
                string: string,
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (query || string) {
            setLoadingResults(true);
            setStatus("initial");
            setShowOptions(false);
            dispatch(
                resultActions.search(
                    {
                        q: query.join(";"),
                        cr: country,
                        hl: language,
                        engine: engine.toLocaleLowerCase(),
                        start: 0,
                        string: string,
                    },
                    (status = "initial")
                )
            ).then(async (data) => {
                navigate("/search");
                dispatch(searchActions.getRecentQueries());
                if (
                    data.results &&
                    data.results.info &&
                    data.results.info.totalPages
                ) {
                    setTotalPages(data.results.info.totalPages);
                }
                setLoadingResults(false);
            });
            // console.log(status)
            setSearch(true);
            setStatus("next");
            setVisitedResults([]);
            setCurrentSelected(null);
            setPageNum(1);
        }
    };
    useEffect(() => {
        console.log("Query in SearchBar updated:", query);
    }, [query]);

    return (
        <div
            className={`w-full bg-zinc-900 flex flex-col font-bold rounded transition-all duration-300 ease-in-out items-center justify-center`}
            id="search-bar-inner"
            data-collapse="collapse"
        >
            <form
                className={`w-full flex text-slate-200 items-center`}
                data-collapse-target="collapse"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="flex items-center w-full h-[4vh] fit justify-content-between p-2">
                    <div className={`flex flex-row h-fit items-center w-full`}>
                        <img
                            src={require("../../../assets/images/arrow-forward-2.png")}
                            className={`h-[2.5vh] w-8 flex flex-row transition-all duration-300 ease-in-out z-20 ${
                                showOptions ? "rotate-90" : ""
                            } cursor-pointer`}
                            onClick={() => setShowOptions(!showOptions)}
                            alt="show options"
                        />
                        <div
                            className={`flex flex-row jusitfy-center h-[2vh] w-full items-center`}
                        >
                            <div
                                className={`flex w-full bg-zinc-800 rounded-full px-2 py-1 justify-between items-center h-8 mr-1`}
                            >
                                <input
                                    placeholder="Search"
                                    className={`p-1 bg-zinc-800 rounded w-full outline-none h-full`}
                                    value={string}
                                    onChange={(e) => setString(e.target.value)}
                                    onClick={() => setShowOptions(true)}
                                />
                                <img
                                    src={clearText}
                                    className="h-full"
                                    onClick={() => setString("")}
                                />
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="flex flex-row w-fit"></div>
                </div>
                {(query && query.length) || string ? (
                    <button
                        className="flex justify-self-end px-3 py-1 mx-1 border rounded hover:bg-zinc-600 focus:outline-none"
                        type="submit"
                    >
                        <img src={searchIcon} className="h-6" />
                        {/* <button className="focus:outline-none">Search</button> */}
                    </button>
                ) : (
                    ""
                )}
            </form>
            {query && query.length && showOptions ? (
                <div className="flex flex-row align-items-center justify-end p-1 w-full">
                    <img
                        className="h-8 cursor-pointer px-1"
                        src={require("../../../assets/icons/save.png")}
                        onClick={() => saveQuery()}
                        alt="save query"
                    />
                    <p
                        className={`px-1 text-white rounded h-8 flex align-items-center hover:text-slate-900 cursor-pointer`}
                        onClick={() => setQuery([])}
                    >
                        Clear
                    </p>
                </div>
            ) : (
                <></>
            )}
            <div className="flex flex-wrap p-1 w-full">
                {query &&
                    query.map((param, index) => {
                        if (param.includes(":")) {
                            return (
                                <QueryParam
                                    param={param}
                                    query={query}
                                    setQuery={setQuery}
                                    index={index}
                                />
                            );
                        }
                    })}
            </div>

            {showOptions && (
                <div className={`flex flex-col bg-zinc-800 rounded w-full`}>
                    <div className={`w-full`}>
                        {Object.keys(settings[engine].operators).map(
                            (param) => (
                                <Parameter
                                    query={query}
                                    setQuery={setQuery}
                                    text={param}
                                    param={settings[engine].operators[param]}
                                />
                            )
                        )}
                    </div>
                    <div className={`w-full h-full divide-y divide-slate-500`}>
                        {(engine === "Google" || engine === "Bing") && (
                            <div className="p-2">
                                <select
                                    // id="normalize"
                                    className="pl-2 cursor-pointer"
                                    onChange={(e) =>
                                        setLanguage(
                                            settings[engine].languages[
                                                e.target.value
                                            ]
                                        )
                                    }
                                >
                                    <option selected={language === ""} disabled>
                                        Language
                                    </option>

                                    {Object.keys(
                                        settings[engine].languages
                                    ).map((name) => (
                                        <option
                                            selected={
                                                settings[engine].languages[
                                                    name
                                                ] === language
                                            }
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
                                className="pl-2 cursor-pointer"
                                onChange={(e) =>
                                    setCountry(
                                        settings[engine].countries[
                                            e.target.value
                                        ]
                                    )
                                }
                            >
                                <option
                                    selected={country === ""}
                                    disabled
                                    className=""
                                >
                                    Country
                                </option>

                                {Object.keys(settings[engine].countries).map(
                                    (name) => (
                                        <option
                                            value={name}
                                            selected={
                                                settings[engine].countries[
                                                    name
                                                ] === country
                                            }
                                        >
                                            {name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="flex flex-row text-white p-2">
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
                                    <option
                                        value={"Bing"}
                                        onClick={() => setEngine("Bing")}
                                    >
                                        Bing
                                    </option>
                                    {/* <option value={"Yandex"}>Yandex</option> */}
                                </select>
                            </label>
                        </div>
                        )
                    </div>
                </div>
            )}
        </div>
    );
}
