import { useState } from "react";
import { isMobile } from "react-device-detect";
import MobileGuidePage from "./MobileGuidePage";
import guideInfo from "./guide-info.json";
import ResultCard from "../Results/ResultCard";

const Card = ({ operator, description, example, exampleData }) => {
    return (
        <div className="p-6 bg-zinc-700 rounded-lg shadow-md mb-6" id={operator.split('').filter(char => char !== ' ').join('').toLowerCase()}>
            <h1 className="text-3xl text-amber-500 mb-2">{operator}</h1>
            <p className="text-zinc-200 mb-4">{description}</p>
            {Object.keys(exampleData).map((row) => {
                return (
                    <ResultCard data={exampleData} rowKey={row} displayOnly={true} />
                )
            }
            )}
            <p className="text-lg mb-1">Example:</p>
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

export default function GuidePage() {
    const [engine, setEngine] = useState("google");
    const [selectedOperator, setSelectedOperator] = useState(0);
    if (isMobile) {
        return <MobileGuidePage />;
    }
    else return (
        <div className="min-h-full w-full bg-zinc-900 text-white p-8 pb-0 flex flex-row">
            <div className="p-4 bg-zinc-800 rounded-lg shadow-md w-1/6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Operators</h2>
                <div className="flex flex-col space-y-2 w-full">
                    {Object.values(guideInfo[engine]).map((info, index) => (
                        <a
                            key={index}
                            className={`p-2 rounded cursor-pointer w-full ${selectedOperator === index ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'} hover:text-white hover:underline-none`}
                            onClick={() => setSelectedOperator(index)}
                            href={`#${info.operator.split('').filter(char => char !== ' ').join('').toLowerCase()}`}
                        >
                            <p className="text-lg w-fit">{info.operator}</p>
                        </a>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-full px-8">
                <div className="flex justify-start mb-8">
                    <button
                        className={`mx-2 px-4 py-2 rounded ${engine === 'google' ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'} focus:outline-none`}
                        onClick={() => setEngine('google')}
                    >
                        Google
                    </button>
                    <button
                        className={`mx-2 px-4 py-2 rounded ${engine === 'bing' ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'} focus:outline-none`}
                        onClick={() => setEngine('bing')}
                    >
                        Bing
                    </button>
                </div>
                <div className="w-fit overflow-y-auto h-full">
                    <div className="p-6 bg-zinc-700 rounded-lg shadow-md mb-6">
                        <div className="w-1/2">
                            <h1 className="text-3xl mb-4 text-amber-500">What is this ?</h1>
                            <p className="text-wrap">The basic idea of search operators is simple:
                                They're special commands you type into a search box to make your searches more precise. Instead of just typing regular words, you add these special symbols or words to tell the search engine exactly what you want to find or avoid.
                                It's like giving the search engine extra instructions to help it understand what you're really looking for.</p>
                        </div>
                    </div>

                    {Object.values(guideInfo[engine]).map((info, index) => (
                        (
                            <Card
                                key={index}
                                operator={info.operator}
                                description={info.description}
                                example={info.example}
                                exampleData={info.exampleData}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};
