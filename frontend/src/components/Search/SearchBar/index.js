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
    const isCurrentSearch = window.location.pathname === '/search/current'
    const { setPageNum, setTotalPages } = useContext(ResultsContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [gptSearch, setGptSearch] = useState(false);
    const [padding, setPadding] = useState('5')
    const [selectedOperator, setSelectedOperator] = useState(null);

    const settings = { Google: googleSettings, Bing: bingSettings };

    const {
        setSearch,
        setLoadingResults,
        showOptions,
        setShowOptions,
        queryLen,
        hasReachCharLimit,
        currCharCount,
        maxCharCount,
        searchState,
        clickHistory,
    } = useContext(SearchContext);

    useEffect(() => {
        if (showOptions) setPadding('5')
        else setPadding('0')
    }, [showOptions])

    useEffect(() => {
        const path = window.location.pathname === '/search'
        if (path) {
            setShowOptions(true)
        }
    }, [])

    const saveQuery = () => {
        const options = {
            q: searchState.query.join(";"),
            hl: searchState.language,
            engine: searchState.engine.toLocaleLowerCase(),
            start: 0,
            string: searchState.string,
        };
        if (searchState.engine === "Bing") {
            options.location = searchState.country;
        } else {
            options.cr = searchState.country;
        }
        dispatch(searchActions.saveQuery(options));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currCharCount >= maxCharCount) return;
        if (searchState.query || searchState.string) {
            setLoadingResults(true);
            setStatus("initial");
            setShowOptions(false);
            let options = {};
            if (!gptSearch) {
                options = {
                    q: searchState.query.join(";"),
                    hl: searchState.language,
                    engine: searchState.engine.toLocaleLowerCase(),
                    start: 0,
                    string: searchState.string,
                };
            } else {
                options = {
                    q: searchState.string,
                    start: 0,
                    gpt: true,
                };
            }
            if (searchState.engine === "Bing") {
                options.location = searchState.country;
            } else {
                options.cr = searchState.country;
            }
            searchState.updateQuery(options)
            dispatch(resultActions.search(options, (status = "initial"))).then(
                async (data) => {
                    navigate("/search");
                    // const resultsContainer = window.document.querySelector("#inner-result");
                    // const bottomPosition = resultsContainer.scrollHeight;
                    // resultsContainer.scrollTo(0, 0)
                    if (

                        data?.results?.info?.totalPages
                    ) {
                        setTotalPages(data.results.info.totalPages);
                        setPadding('0')
                    }
                    setLoadingResults(false);
                }
            );
            setSearch(true);
            setStatus("next");
            clickHistory.setVisitedResults([]);
            clickHistory.setCurrentSelected(null);
            setPageNum(1);
        }
    };

    if (isMobile)
        return <MobileSearchBar setStatus={setStatus} status={status} selectedOperator={selectedOperator} setSelectedOperator={setSelectedOperator} />;
    else
        return (
            <div
                className={`w-full flex flex-col font-bold rounded transition-all duration-300 ease-in-out items-center justify-center py-${padding} z-50 bg-zinc-800`}
                id="search-bar-inner"
            >
                <form
                    className={`w-full flex items-center justify-center`}
                    data-collapse-target="collapse"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="flex items-center w-3/5 h-fit justify-center p-2">
                        <div
                            className={`flex flex-row h-fit items-center w-full`}
                        >
                            {!isProduction && (
                                <div
                                    className={`w-12 h-5 ${gptSearch
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
                                className={`h-[2.5vh] w-8 flex flex-row transition-all duration-300 ease-in-out z-20 ${showOptions ? "rotate-90" : ""
                                    } cursor-pointer`}
                                onClick={() => setShowOptions(!showOptions)}
                                alt="show options"
                            />
                            <div
                                className={`flex flex-row jusitfy-center h-fit w-full items-center`}
                            >
                                <div
                                    className={`flex w-full rounded-full px-2 py-1 justify-between bg-white/5 backdrop-blur-xl items-center h-fit mr-1`}
                                >
                                    <div className="flex flex-row justify-center items-center h-fit">
                                        <label className="flex items-center h-fit m-0">
                                            <select
                                                onChange={(e) => {
                                                    searchState.updateQuery({ engine: e.target.value })
                                                    searchState.setEngine(e.target.value)
                                                }}
                                                className="rounded ml-1 cursor-pointer bg-transparent text-2xl focus:outline-none text-white"
                                            >
                                                <option
                                                    selected={"Google" === isCurrentSearch ? searchState.currentSearchStatus.engine : searchState.engine}
                                                    value={"Google"}
                                                    defaultValue
                                                    className="text-black"
                                                >
                                                    Google
                                                </option>
                                                {/* <option value={"Baidu"}>Baidu</option> */}
                                                <option
                                                    value={"Bing"}
                                                    selected={"Bing" === isCurrentSearch ? searchState.currentSearchStatus.engine : searchState.engine}
                                                    className="text-black"
                                                >
                                                    Bing
                                                </option>
                                                {/* <option value={"Yandex"}>Yandex</option> */}
                                            </select>
                                        </label>
                                    </div>
                                    <input
                                        placeholder="Search"
                                        className={`px-1 bg-white/0 rounded w-full outline-none h-full text-white poppins-light text-lg`}
                                        value={isCurrentSearch ? searchState.currentSearchStatus.string : searchState.string}
                                        onChange={(e) => {
                                            searchState.updateQuery({ string: e.target.value })
                                            searchState.setString(e.target.value)
                                        }}
                                        onClick={() => setShowOptions(true)}
                                    />
                                    {searchState.string ? (
                                        <img
                                            src={clearText}
                                            className="h-10 cursor-pointer"
                                            onClick={() => searchState.updateQuery({ string: "" })}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    {currCharCount >= maxCharCount - 100 ? <div
                                        className={`${currCharCount >= maxCharCount
                                            ? "!text-red-400"
                                            : "!text-amber-400"
                                            }  `}
                                    >
                                        <p>
                                            {currCharCount}/{maxCharCount}
                                        </p>
                                    </div> : <></>}
                                </div>
                                {queryLen() && !hasReachCharLimit() ? (
                                    <button
                                        className="flex justify-self-end px-3 mx-1 hover:bg-zinc-600 rounded-full focus:outline-none"
                                        type="submit"
                                    >
                                        <img src={searchIcon} className="h-10" />
                                    </button>
                                ) : (
                                    <div className="px-3 mx-1">
                                        <div className="w-6" />
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
                                    {searchState.query && searchState.query.length ? <p
                                        className={`text-white rounded h-8 flex align-items-center hover:text-slate-900 cursor-pointer`}
                                        onClick={() => searchState.setQuery([])}
                                    >
                                        Clear
                                    </p> : <></>}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </form>
                {searchState?.query?.length && !isCurrentSearch ? (
                    <div className="flex flex-wrap p-1 w-3/5">
                        {searchState.query.map((param, index) => {
                            if (param.includes(":")) {
                                return (
                                    <QueryParam
                                        param={param}
                                        index={index}
                                        key={`query-param-${index}`}
                                    />
                                );
                            }
                        })}
                    </div>
                ) : (
                    <></>
                )}
                {searchState?.query?.length && isCurrentSearch ? (
                    <div className="flex flex-wrap p-1 w-3/5">
                        {searchState.currentSearchStatus.query.map((param, index) => {
                            if (param.includes(":")) {
                                return (
                                    <QueryParam
                                        param={param}
                                        index={index}
                                        key={`query-param-${index}`}
                                    />
                                );
                            }
                        })}
                    </div>
                ) : (
                    <></>
                )}
                {showOptions && (
                    <div className={`flex flex-row w-3/5 flex-wrap`}>
                        <div className={`w-full grid grid-cols-3`}>
                            {Object.keys(settings[searchState.engine].operators).map(
                                (param, index) => (
                                    <Parameter
                                        key={`param-${param}`}  // Add this line
                                        index={index}
                                        text={param}
                                        param={
                                            settings[searchState.engine].operators[param]
                                        }
                                        selectedOperator={selectedOperator}
                                        setSelectedOperator={setSelectedOperator}
                                    />
                                )
                            )}
                            {(searchState.engine === "Google" || searchState.engine === "Bing") && (
                                <select
                                    className="pl-1 py-1 cursor-pointer bg-zinc-900 w-full text-white rounded"
                                    onChange={(e) => {
                                        searchState.setLanguage(
                                            settings[searchState.engine].languages[
                                            e.target.value
                                            ]
                                        )
                                        searchState.updateQuery({ hl: settings[searchState.engine].languages[e.target.value] })
                                    }}
                                >
                                    <option
                                        key="language-default"
                                        selected={searchState.language === ""}
                                        disabled
                                    >
                                        Language
                                    </option>

                                    {Object.keys(
                                        settings[searchState.engine].languages
                                    ).map((name) => (
                                        <option
                                            key={`language-${name}`}
                                            selected={
                                                settings[searchState.engine].languages[
                                                name
                                                ] === searchState.language
                                            }
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <select
                                className="pl-1 py-1 cursor-pointer bg-zinc-900 w-full h-full text-white flex items-center"
                                onChange={(e) => {
                                    const newCountry = searchState.engine === "Google" ? { cr: settings[searchState.engine].countries[e.target.value] } : { location: settings[searchState.engine].countries[e.target.value] }
                                    searchState.updateQuery(newCountry)
                                    console.log(searchState.currentSearchStatus)
                                    searchState.setCountry(settings[searchState.engine].countries[e.target.value])
                                }}
                            >
                                <option
                                    key="country-default"
                                    selected={searchState.country === ""}
                                    disabled
                                    className=""
                                >
                                    Country
                                </option>

                                {Object.keys(
                                    settings[searchState.engine].countries
                                ).map((name) => (
                                    <option
                                        key={`country-${name}`}
                                        value={name}
                                        selected={
                                            settings[searchState.engine].countries[
                                            name
                                            ] === searchState.country
                                        }
                                    >
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        );
}
