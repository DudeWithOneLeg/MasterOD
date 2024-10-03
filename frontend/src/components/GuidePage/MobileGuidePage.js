import { useState } from "react";
import guideInfo from "./guide-info.json";
import ResultCard from "../Results/ResultCard";
import rightArrow from "../../assets/images/arrow-forward-2.png";

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

export default function MobileGuidePage() {
    const [engine, setEngine] = useState("google");
    const [selectedOperator, setSelectedOperator] = useState(0);
    const [showListOfOperators, setShowListOfOperators] = useState(false);

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
                        className={`mx-1 px-3 py-1 rounded text-sm ${engine === 'bing' ? 'bg-amber-700' : 'bg-zinc-700'}`}
                        onClick={() => setEngine('bing')}
                    >
                        Bing
                    </button>
                </div>
            </div>


            <div className="mb-4 p-4 bg-zinc-800 rounded-lg shadow-md">
                <div onClick={() => setShowListOfOperators(!showListOfOperators)} className={`flex flex-row items-center justify-start ${showListOfOperators ? "mb-2" : ""}`}>
                    <img src={rightArrow} alt="right-arrow" className={`h-6 w-6 flex flex-row transition-all duration-300 ease-in-out z-20 ${showListOfOperators ? "rotate-90" : ""
                                    } cursor-pointer`} />
                    <h2 className="text-xl h-fit">Operators:</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {showListOfOperators ? Object.values(guideInfo[engine]).map((info, index) => (
                        <a
                            key={index}
                            className={`p-2 rounded cursor-pointer w-full ${selectedOperator === index ? 'bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-600'} hover:text-white hover:underline-none`}
                            onClick={() => {
                                setSelectedOperator(index);
                            }}

                            href={`#${info.operator.split('').filter(char => char !== ' ').join('').toLowerCase()}`}
                        >
                            {info.operator}
                        </a>
                    )) : <></>}
                </div>
            </div>

            <div className="w-full overflow-y-auto h-full">
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
    );
}
