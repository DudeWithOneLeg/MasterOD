import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Parameter from "../Parameter";
import QueryParam from "../QueryParam";
import { bingSettings } from "./BingSettings/bingSettings";
import { googleSettings } from "./GoogleSettings/googleSettings";
import * as searchActions from "../../../store/search";
import * as resultActions from "../../../store/result";
import { isMobile } from "react-device-detect";
import MobileSearchBar from "./MobileSearchBar";
const clearText = require("../../../assets/images/clear.png");
const searchIcon = require("../../../assets/images/search.png");

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
    setStatus,
    status,
    setSearch,
    setTotalPages,
    setVisitedResults,
    setCurrentSelected,
    setLoadingResults,
    setPageNum,
    showOptions,
    setShowOptions,
}) {
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
            setSearch(true);
            setStatus("next");
            setVisitedResults([]);
            setCurrentSelected(null);
            setPageNum(1);
        }
    };

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
                    <div className={`flex flex-row h-fit items-center w-3/4`}>
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
                    <div className="flex flex-row w-fit">
                        {string ? (
                            <div className="flex flex-row align-items-center justiify between px-2">
                                <img
                                    className="h-8 cursor-pointer px-2"
                                    src={require("../../../assets/icons/save.png")}
                                    onClick={() => saveQuery()}
                                    alt="save query"
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="flex flex-row justify-center items-center">
                            <p className="text-center">Engine:</p>
                            <label className="flex items-center h-8 m-0">
                                <select
                                    onChange={(e) => setEngine(e.target.value)}
                                    className="bg-slate-500 rounded ml-1 cursor-pointer"
                                >
                                    <option selected defaultValue>
                                        Google
                                    </option>
                                    {/* <option value={"Baidu"}>Baidu</option> */}
                                    <option value={"Bing"}>Bing</option>
                                    {/* <option value={"Yandex"}>Yandex</option> */}
                                </select>
                            </label>
                        </div>
                    </div>
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
            {showOptions && (
                <div className={`flex flex-row bg-zinc-800 rounded w-full`}>
                    <div className={`w-1/3 h-full divide-y divide-slate-500`}>
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
                    </div>
                </div>
            )}
        </div>
    );
}