import { useSelector } from "react-redux";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MobileSideBar from "./MobileSidebar";
import * as sessionActions from "../../store/session";
import RecentStats from "./RecentStats";
import { SearchContext } from "../../context/SearchContext";
import SideBarFooter from "./SideBarFooter";
// import SearchBar from "../SearchBar";

export default function SideBar() {
    const { searchState } = useContext(SearchContext);
    const navigate = useNavigate();
    const user = useSelector((state) => state.session.user);
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [feedbackEmail, setFeedbackEmail] = useState("");
    const [sentFeedback, setSentFeedback] = useState(false);

    const handleSendFeedback = (e) => {
        e.preventDefault();
        if (!feedbackMsg.length) return
        sessionActions.sendFeedback({
            text: feedbackMsg,
            email: feedbackEmail,
        });
        setSentFeedback(true);
        setFeedbackMsg("");
    };

    const handleNewSearch = () => {
        searchState.setQuery([]);
        searchState.setString("");
        navigate("/search");
    };

    if (isMobile) return <MobileSideBar setSearch={searchState.setSearch} />;

    return (
        <div className=" p-2">
            <div className="h-full w-[300px] flex flex-row text-slate-100 bg-zinc-900 rounded-lg">
                <div className={`flex flex-row w-full`}>
                    {user ? (
                        <div
                            className={`p-2 w-full flex flex-col justify-between h-full`}
                        >
                            <div className="flex flex-col w-full">
                                <div className="w-full flex flex-row items-center justify-between h-fit"></div>
                                <div className={`p-2 text-lg space-y-2`}>
                                    <div
                                        onClick={handleNewSearch}
                                        className="flex flex-row text-2xl items-center cursor-pointer p-2 py-2 rounded bg-zinc-200 hover:bg-white text-black"
                                    >
                                        <img
                                            src={require("../../assets/images/plus.png")}
                                            className="h-8"
                                            alt="new search"
                                        />
                                        Search
                                    </div>
                                    {/* <div
                                        onClick={() => navigate('/results/all/new')}
                                        className="flex flex-row text-2xl items-center cursor-pointer p-2 py-2 rounded bg-zinc-200 hover:bg-white text-black"
                                    >
                                        <img
                                            src={require("../../assets/images/plus.png")}
                                            className="h-8"
                                            alt="new search"
                                        />
                                        Resource Group
                                    </div> */}
                                    {/* <div className="h-2" /> */}
                                    {/* <div className="w-full p-2 text-2xl underline text-blue-600 poppins-regular-italic" onClick={() => navigate('/search/current')}>
                                        <h1>Current Search</h1>
                                    </div> */}
                                    <div className="divide-y divide-zinc-600">

                                    <RecentStats setSearch={searchState.setSearch} />
                                    </div>
                                </div>
                            </div>
                            {!sentFeedback ? (
                                <form
                                    onSubmit={(e) => handleSendFeedback(e)}
                                    className="h-fit !text-zinc-200"
                                >
                                    <p className="text-2xl">Feedback:</p>
                                    <div className="h-2" />
                                    <div className="p-1">

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
                                                className="focus:outline-none rounded p-1 hover:bg-zinc-600 w-fit align-self-end"
                                            >
                                                Send Feedback
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <p>Thank you for your feedback.</p>
                            )}
                            <SideBarFooter />
                        </div>
                    ) : (
                        <div className="w-[300px]"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
