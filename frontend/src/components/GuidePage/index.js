import { useState } from "react";
import guideInfo from "./guide-info.json";

const Card = ({ operator, description, example }) => {
    return (
        <div className="p-6 bg-zinc-700 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-amber-500 mb-2">{operator}</h1>
            <p className="text-lg font-semibold mb-1">Description:</p>
            <p className="text-zinc-200 mb-4">{description}</p>
            <p className="text-lg font-semibold mb-1">Example:</p>
            <div className="text-zinc-200 bg-zinc-800 rounded p-3">

            <div className="flex flex-row w-full items-end rounded h-full">
                <div className="rounded-left flex-shrink-0 text-white h-fit !text-zinc-100 text-lg">
                    <p>{operator}</p>
                </div>
                    <p
                        className={`pl-2 pr-0 outline-none w-full !bg-zinc-800 h-fit text-white parameter-input poppins-bold`}
                    >{example}</p>
                {/* {input && input.split(param.text)[1] && (
                    <button
                        type="submit"
                        className="rounded-right bg-zinc-300 hover:bg-slate-600 h-full"
                    >
                        <img
                            src={require("../../../assets/images/plus.png")}
                            className="w-fit mr-0 self-end px-1 h-full"
                        />
                    </button>
                )} */}
            </div>
            </div>
        </div>
    );
};

export default function GuidePage() {
    const [engine, setEngine] = useState("google");
    const [selectedOperator, setSelectedOperator] = useState(0);

    return (
        <div className="min-h-full w-full bg-zinc-900 text-white p-8 flex flex-row">
                <div className="p-4 bg-zinc-800 rounded-lg shadow-md w-1/6">
                    <h2 className="text-2xl font-bold mb-4">Operators</h2>
                    <div className="flex flex-col space-y-2 w-full">
                        {Object.values(guideInfo[engine]).map((info, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded cursor-pointer w-full ${selectedOperator === index ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                                onClick={() => setSelectedOperator(index)}
                            >
                                <p className="text-lg w-fit">{info.operator}</p>
                            </div>
                        ))}
                    </div>
                </div>
            <div className="flex flex-col w-full px-8">
                <div className="flex justify-start mb-8">
                    <button
                        className={`mx-2 px-4 py-2 rounded ${engine === 'google' ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                        onClick={() => setEngine('google')}
                    >
                        Google
                    </button>
                    <button
                        className={`mx-2 px-4 py-2 rounded ${engine === 'bing' ? 'bg-amber-500' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                        onClick={() => setEngine('bing')}
                    >
                        Bing
                    </button>
                </div>
                <div className="w-fit">
                    {Object.values(guideInfo[engine]).map((info, index) => (
                        index === selectedOperator && (
                            <Card
                                key={index}
                                operator={info.operator}
                                description={info.description}
                                example={info.example}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
