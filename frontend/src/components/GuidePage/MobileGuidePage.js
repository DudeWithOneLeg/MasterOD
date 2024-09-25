import { useState } from "react";
import guideInfo from "./guide-info.json";

const Card = ({ operator, description, example }) => {
    return (
        <div className="p-6 bg-zinc-700 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-amber-500 mb-2">{operator}</h1>
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
            </div>
            </div>
        </div>
    );
};

export default function MobileGuidePage() {
    const [engine, setEngine] = useState("google");
    const [selectedOperator, setSelectedOperator] = useState(0);

    return (
        <div className="min-h-full w-full bg-zinc-900 text-white p-4 flex flex-col">
            <div className="flex justify-between mb-4">
                <div className="flex">
                    <button
                        className={`mx-1 px-3 py-1 rounded text-sm ${engine === 'google' ? 'bg-amber-700' : 'bg-zinc-700'}`}
                        onClick={() => setEngine('google')}
                    >
                        Google
                    </button>
                    <button
                        className={`mx-1 px-3 py-1 rounded text-sm ${engine === 'bing' ? 'bg-amber-500' : 'bg-zinc-700'}`}
                        onClick={() => setEngine('bing')}
                    >
                        Bing
                    </button>
                </div>
            </div>


                <div className="mb-4 p-4 bg-zinc-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Operators</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(guideInfo[engine]).map((info, index) => (
                            <button
                                key={index}
                                className={`p-2 rounded text-sm ${selectedOperator === index ? 'bg-amber-700' : 'bg-zinc-700'} focus:outline-none`}
                                onClick={() => {
                                    setSelectedOperator(index);
                                }}
                            >
                                {info.operator}
                            </button>
                        ))}
                    </div>
                </div>

            <div className="w-full">
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
    );
}
