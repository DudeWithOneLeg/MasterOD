import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../../context/SearchContext";
import { ResultsContext } from "../../../context/ResultsContext";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam.js";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as searchActions from "../../../store/search";
import * as resultActions from "../../../store/result";
const clearText = require("../../../assets/images/clear.png");
const searchIcon = require("../../../assets/images/search.png");

export default function MobileSearchBar({ setStatus, status, selectedOperator, setSelectedOperator }) {
    const {
        setLoadingResults,
        showOptions,
        setShowOptions,
        queryLen,
        hasReachCharLimit,
        currCharCount,
        maxCharCount,
        searchState,
        clickHistory
    } = useContext(SearchContext);
    const { setPageNum, setTotalPages } = useContext(ResultsContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const settings = { Google: googleSettings, Bing: bingSettings };

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

        if (searchState.query || searchState.string) {
            setLoadingResults(true);
            setStatus("initial");
            setShowOptions(false);
            let options = {};
            options = {
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
            searchState.updateQuery(options)
            dispatch(resultActions.search(options, (status = "initial"))).then(
                async (data) => {
                    navigate("/search");
                    dispatch(searchActions.getRecentQueries());
                    if (data?.results?.info?.totalPages) {
                        setTotalPages(data.results.info.totalPages);
                    }
                    setLoadingResults(false);
                }
            );
            searchState.setSearch(true);
            setStatus("next");
            clickHistory.setVisitedResults([]);
            clickHistory.setCurrentSelected(null);
            setPageNum(1);
        }
    };

    return (
        <div
            className={`w-full flex flex-col font-bold rounded transition-all duration-300 ease-in-out items-center justify-center`}
            id="search-bar-inner"
            data-collapse="collapse"
        >
            <form
                className={`w-full flex text-slate-200 items-center`}
                data-collapse-target="collapse"
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className="flex items-center w-full h-[4vh] fit justify-content-between m-1">
                    <div className={`flex flex-row h-full items-center w-full`}>
                        <img
                            src={require("../../../assets/images/arrow-forward-2.png")}
                            className={`h-[2.5vh] w-8 flex flex-row transition-all duration-300 ease-in-out z-20 ${showOptions ? "rotate-90" : ""
                                } cursor-pointer`}
                            onClick={() => setShowOptions(!showOptions)}
                            alt="Show search options."
                        />
                        <div
                            className={`flex flex-row h-full w-full jusitfy-center items-center`}
                        >
                            <div
                                className={`flex w-full h-full bg-zinc-800 rounded-full px-2 justify-between items-center`}
                            >
                                <div className="flex flex-row justify-center items-center h-full">
                                    <label className="flex items-center h-full m-0">
                                        <select
                                            onChange={(e) =>
                                                searchState.setEngine(e.target.value)
                                            }
                                            className="rounded ml-1 cursor-pointer text-xl focus:outline-none text-white bg-zinc-800 flex items-center justify-center"
                                        >
                                            <option
                                                selected={"Google" === searchState.engine}
                                                defaultValue
                                            >
                                                Google
                                            </option>
                                            {/* <option value={"Baidu"}>Baidu</option> */}
                                            <option
                                                value={"Bing"}
                                                selected={"Bing" === searchState.engine}
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
                                    value={searchState.string}
                                    onChange={(e) => {
                                        searchState.updateQuery({ string: e.target.value })
                                        searchState.setString(e.target.value)
                                    }}
                                    onClick={() => setShowOptions(true)}
                                />
                                <img
                                    src={clearText}
                                    className="h-full"
                                    onClick={() => searchState.setString("")}
                                    alt="Clear search bar text."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-fit"></div>
                </div>
                {queryLen() && !hasReachCharLimit() ? (
                    <button
                        className="flex justify-self-end rounded focus:outline-none mx-1"
                        type="submit"
                    >
                        <img src={searchIcon} className="h-8" alt="Submit search."/>
                        {/* <button className="focus:outline-none">Search</button> */}
                    </button>
                ) : currCharCount >= maxCharCount - 100 ? (
                    <div
                        className={`${currCharCount >= maxCharCount
                            ? "!text-red-400"
                            : "!text-amber-400"
                            }  `}
                    >
                        <p>
                            {currCharCount}/{maxCharCount}
                        </p>
                    </div>
                ) : (
                    <></>
                )}
            </form>
            {searchState.query && searchState.query.length && showOptions ? (
                <div className="flex flex-row align-items-center justify-end p-1 w-full">
                    <img
                        className="h-8 cursor-pointer px-1"
                        src={require("../../../assets/icons/save.png")}
                        onClick={() => saveQuery()}
                        alt="save query"
                    />
                    <p
                        className={`px-1 text-white rounded h-8 flex align-items-center hover:text-slate-900 cursor-pointer`}
                        onClick={() => searchState.setQuery([])}
                    >
                        Clear
                    </p>
                </div>
            ) : (
                <></>
            )}

            {showOptions && (
                <div className="flex flex-col w-full p-2">
                    {searchState.query ? (
                        <div className="flex flex-wrap p-1 w-full">
                            {searchState.query.map((param, index) => {
                                if (param.includes(":")) {
                                    return (
                                        <QueryParam
                                            param={param}
                                            index={index}
                                        />
                                    );
                                } else return<></>
                            })}
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className={`flex flex-col bg-zinc-800 rounded w-full`}>
                        <div className={`w-full`}>
                            {Object.keys(settings[searchState.engine].operators).map(
                                (param, index) => (
                                    <Parameter
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
                        </div>
                        <div
                            className={`w-full h-full text-zinc-800`}
                        >
                            {(searchState.engine === "Google" || searchState.engine === "Bing") && (
                                <div className="p-2">
                                    <select
                                        // id="normalize"
                                        className="pl-2 cursor-pointer bg-zinc-900 text-white py-1 rounded"
                                        onChange={(e) => {
                                            searchState.setLanguage(
                                                settings[searchState.engine].languages[
                                                e.target.value
                                                ]
                                            )
                                            searchState.updateQuery({hl: settings[searchState.engine].languages[e.target.value]})
                                        }}
                                    >
                                        <option
                                            selected={searchState.language === ""}
                                            disabled
                                        >
                                            Language
                                        </option>

                                        {Object.keys(
                                            settings[searchState.engine].languages
                                        ).map((name) => (
                                            <option
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
                                </div>
                            )}
                            <div className="p-2">
                                <select
                                    // id="normalize"
                                    className="pl-2 cursor-pointer text-white bg-zinc-900 py-1 rounded w-full"
                                    onChange={(e) => {
                                        const newCountry = searchState.engine === "Google" ? { cr: settings[searchState.engine].countries[e.target.value] } : { location: settings[searchState.engine].countries[e.target.value] }
                                        searchState.updateQuery(newCountry)
                                        console.log(searchState.currentSearchStatus)
                                        searchState.setCountry(settings[searchState.engine].countries[e.target.value])
                                    }}
                                >
                                    <option
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
                    </div>
                </div>
            )}
        </div>
    );
}
