import { useDispatch, useSelector } from "react-redux";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MobileSideBar from "./MobileSidebar";
import * as searchActions from "../../store/search";
import * as resultActions from "../../store/result";
import * as sessionActions from "../../store/session";
import RecentStats from "./RecentStats";
import { SearchContext } from "../../context/SearchContext";
// import SearchBar from "../SearchBar";

export default function SideBar() {
    const { setSearch, setQuery, setString } = useContext(SearchContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.session.user);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [feedbackEmail, setFeedbackEmail] = useState("");
    const [sentFeedback, setSentFeedback] = useState(false);

    const handleSendFeedback = (e) => {
        e.preventDefault();
        sessionActions.sendFeedback({
            text: feedbackMsg,
            email: feedbackEmail,
        });
        setSentFeedback(true);
        setFeedbackMsg("");
    };

    useEffect(() => {
        if (user) {
            dispatch(searchActions.getRecentQueries());
            dispatch(resultActions.getRecentSavedResults());
            dispatch(searchActions.getRecentSavedQueries());
            dispatch(resultActions.getRecentVisitedResults());
        }
    }, [dispatch, user]);

    const handleNewSearch = () => {
        setQuery([]);
        setString("");
        navigate("/search");
    };

    if (isMobile) return <MobileSideBar setSearch={setSearch} />;

    return (
        <div>
            <div className="h-full w-[300px] bg-zinc-900 flex flex-row text-slate-100 border-r border-zinc-500 p-2">
                <div className={`flex flex-row`}>
                    {user ? (
                        <div
                            className={`p-2 w-full flex flex-col justify-between h-full`}
                        >
                            <div className="flex flex-col">
                                <div className="w-full flex flex-row items-center justify-between h-fit"></div>
                                <div className={`p-4 text-lg`}>
                                    <div
                                        onClick={handleNewSearch}
                                        className="flex flex-row items-center cursor-pointer border-2 rounded hover:bg-slate-600"
                                    >
                                        <img
                                            src={require("../../assets/images/plus-white.png")}
                                            className="h-8"
                                            alt="new search"
                                        />
                                        New Search
                                    </div>
                                    <RecentStats setSearch={setSearch} />
                                </div>
                            </div>
                            <div className="flex flex-col border border-green-800 p-2 rounded ">
                                <div>
                                    <p>Developer Notes - Sept 13:</p>
                                </div>
                                <ul>
                                    <li> - Fixed Bing location</li>
                                    <li> - Added Mobile browser support</li>
                                    <li>
                                        {" "}
                                        - Theres a bug when deleting a paramater
                                    </li>
                                </ul>
                            </div>
                            {!sentFeedback ? (
                                <form
                                    onSubmit={(e) => handleSendFeedback(e)}
                                    className="h-fit !text-zinc-200"
                                >
                                    <p className="text-lg">Feedback:</p>
                                    <div className="h-2" />
                                    <input
                                        placeholder="Email (optional)"
                                        onChange={(e) =>
                                            setFeedbackEmail(e.target.value)
                                        }
                                        value={feedbackEmail}
                                        className="bg-zinc-800 mb-2 rounded p-1"
                                    />
                                    <div className="flex flex-col justify-end">
                                        <textarea
                                            onChange={(e) =>
                                                setFeedbackMsg(e.target.value)
                                            }
                                            placeholder={`Have questions or feedback?\nAny features you would like to see?\nHave you experienced bugs that were not fixed?`}
                                            value={feedbackMsg}
                                            className="w-full h-40 bg-zinc-800 rounded p-1 !border-1 !border-zinc-500"
                                        />
                                        <div className="h-2" />

                                        <button
                                            type="submit"
                                            className="focus:outline-none border border-zinc-500 rounded p-1 hover:bg-zinc-600 w-fit align-self-end"
                                        >
                                            Send Feedback
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p>Thank you for your feedback.</p>
                            )}
                            <div className="flex flex-col justify-self-end">
                                Developed by :
                                <a
                                    href="https://www.linkedin.com/in/romeo-galvan-9418b6225/"
                                    className="underline"
                                    target="_blank"
                                >
                                    Romeo (I need a job) Galvan
                                </a>
                                <p>© 2024 Romeo Galvan</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-[300px]"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
