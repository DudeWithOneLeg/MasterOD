import { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as searchActions from "../../../store/search";
import * as resultActions from "../../../store/result";
import { isMobile } from "react-device-detect";
import { SearchContext } from "../../../context/SearchContext";
import { ResultsContext } from "../../../context/ResultsContext";
import MobileSearchBar from "./MobileSearchBar";
const clearText = require("../../../assets/images/clear.png");
const searchIcon = require("../../../assets/images/search.png");

const isProduction = process.env.NODE_ENV === "production";

export default function SearchBar({ status, setStatus }) {
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
        showOptions,
        setShowOptions,
        queryLen,
        hasReachCharLimit,
        currCharCount,
        maxCharCount
    } = useContext(SearchContext);
    const { setPageNum, setTotalPages } = useContext(ResultsContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [gptSearch, setGptSearch] = useState(false);

    const settings = { Google: googleSettings, Bing: bingSettings };



    const saveQuery = () => {
        const options = {
            q: query.join(";"),
            hl: language,
            engine: engine.toLocaleLowerCase(),
            start: 0,
            string: string,
        };
        if (engine === "Bing") {
            options.location = country;
        } else {
            options.cr = country;
        }
        dispatch(searchActions.saveQuery(options));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currCharCount >= maxCharCount) return;
        if (query || string) {
            setLoadingResults(true);
            setStatus("initial");
            setShowOptions(false);
            let options = {};
            if (!gptSearch) {
                options = {
                    q: query.join(";"),
                    hl: language,
                    engine: engine.toLocaleLowerCase(),
                    start: 0,
                    string: string,
                };
            } else {
                options = {
                    q: string,
                    start: 0,
                    gpt: true,
                };
            }
            if (engine === "Bing") {
                options.location = country;
            } else {
                options.cr = country;
            }
            dispatch(resultActions.search(options, (status = "initial"))).then(
                async (data) => {
                    navigate("/search");
                    // const resultsContainer = window.document.querySelector("#inner-result");
                    // const bottomPosition = resultsContainer.scrollHeight;
                    // resultsContainer.scrollTo(0, 0)
                    dispatch(searchActions.getRecentQueries());
                    if (
                        data.results &&
                        data.results.info &&
                        data.results.info.totalPages
                    ) {
                        setTotalPages(data.results.info.totalPages);
                    }
                    setLoadingResults(false);
                }
            );
            setSearch(true);
            setStatus("next");
            setVisitedResults([]);
            setCurrentSelected(null);
            setPageNum(1);
        }
    };


    if (isMobile)
        return <MobileSearchBar setStatus={setStatus} status={status} />;
    else
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
                        <div
                            className={`flex flex-row h-fit items-center w-3/4`}
                        >
                            {!isProduction && (
                                <div
                                    className={`w-12 h-5 ${
                                        gptSearch
                                            ? "bg-green-500 justify-end"
                                            : "bg-zinc-500 justify-start"
                                    } rounded-full flex cursor-pointer`}
                                    onClick={() => setGptSearch(!gptSearch)}
                                >
                                    <div
                                        className={`h-5 w-5 rounded-full bg-zinc-200`}
                                    ></div>
                                </div>
                            )}
                            <img
                                src={require("../../../assets/images/arrow-forward-2.png")}
                                className={`h-[2.5vh] w-8 flex flex-row transition-all duration-300 ease-in-out z-20 ${
                                    showOptions ? "rotate-90" : ""
                                } cursor-pointer`}
                                onClick={() => setShowOptions(!showOptions)}
                                alt="show options"
                            />
                            <div
                                className={`flex flex-row jusitfy-center h-[3vh] w-full items-center`}
                            >
                                <div
                                    className={`flex w-full bg-zinc-800 rounded-full px-2 py-1 justify-between items-center h-8 mr-1`}
                                >
                                    <input
                                        placeholder="Search"
                                        className={`p-1 bg-zinc-800 rounded w-full outline-none h-full`}
                                        value={string}
                                        onChange={(e) =>
                                            setString(e.target.value)
                                        }
                                        onClick={() => setShowOptions(true)}
                                    />
                                    {string ? (
                                        <img
                                            src={clearText}
                                            className="h-full"
                                            onClick={() => setString("")}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    <div className={`text-${
                                                currCharCount >= maxCharCount
                                                    ? "red-400"
                                                    : "zinc-400"
                                            }  `}>
                                        <p

                                        >
                                            {currCharCount}/{maxCharCount}
                                        </p>
                                    </div>
                                </div>
                                {queryLen() && !hasReachCharLimit() ? (
                                    <button
                                        className="flex justify-self-end px-3 py-1 mx-1 rounded hover:bg-zinc-600 focus:outline-none shadow shadow-zinc-400 border-zinc-500"
                                        type="submit"
                                    >
                                        <img src={searchIcon} className="h-6" />
                                    </button>
                                ) : (
                                    <div className="px-3 mx-1">
                                        <div className="w-6"/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row w-fit">
                            {queryLen() ? (
                                <div className="flex flex-row align-items-center justiify between px-2">
                                    {hasReachCharLimit() ? (
                                        <></>
                                    ) : (
                                        <img
                                            className="h-8 cursor-pointer px-2"
                                            src={require("../../../assets/icons/save.png")}
                                            onClick={() => saveQuery()}
                                            alt="save query"
                                        />
                                    )}
                                    <p
                                        className={`text-white rounded h-8 flex align-items-center hover:text-slate-900 cursor-pointer`}
                                        onClick={() => setQuery([])}
                                    >
                                        Clear
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className="flex flex-row justify-center items-center text-lg">
                                <p className="text-center">Engine:</p>
                                <label className="flex items-center h-8 m-0">
                                    <select
                                        onChange={(e) =>
                                            setEngine(e.target.value)
                                        }
                                        className="rounded ml-1 cursor-pointer border border-zinc-500 bg-zinc-900"
                                    >
                                        <option
                                            selected={"Google" === engine}
                                            defaultValue
                                        >
                                            Google
                                        </option>
                                        {/* <option value={"Baidu"}>Baidu</option> */}
                                        <option
                                            value={"Bing"}
                                            selected={"Bing" === engine}
                                        >
                                            Bing
                                        </option>
                                        {/* <option value={"Yandex"}>Yandex</option> */}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
                {query && showOptions && query.length ? (
                    <div className="flex flex-wrap p-1 w-full">
                        {query &&
                            query.map((param, index) => {
                                if (param.includes(":")) {
                                    return (
                                        <QueryParam
                                            param={param}
                                            index={index}
                                        />
                                    );
                                }
                            })}
                    </div>
                ) : (
                    <></>
                )}
                {showOptions && (
                    <div className={`flex flex-row bg-zinc-800 rounded w-full`}>
                        <div className={`w-1/3`}>
                            {Object.keys(settings[engine].operators).map(
                                (param) => (
                                    <Parameter
                                        text={param}
                                        param={
                                            settings[engine].operators[param]
                                        }
                                    />
                                )
                            )}
                        </div>
                        <div
                            className={`w-1/3 h-full divide-y divide-slate-500`}
                        >
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
                                        <option
                                            selected={language === ""}
                                            disabled
                                        >
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

                                    {Object.keys(
                                        settings[engine].countries
                                    ).map((name) => (
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
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
}
