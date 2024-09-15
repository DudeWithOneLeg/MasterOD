import { useState } from "react";
import guideInfo from "./guide-info.json";

const Card = ({operator, description}) => {
    return (
        <div className="p-2">
            <h1 className="text-2xl">{operator}</h1>
            <p className="text-zinc-200">Description: {description}</p>
        </div>
    );
};

export default function GuidePage() {
    const [engine, setEngine] = useState("google");
    const [selectedOperator, setSelectedOperator] = useState(0);
    return (
        <div className="h-full w-full grid grid-cols-6 bg-zinc-800">
            <div className="h-full w-full grid grid-rows-3 p-4 text-white items-center shadow-right z-20">
                <div className="flex flex-col w-full">
                    <div className={`w-full p-2 rounded ${engine === 'google' ? 'bg-zinc-900' : 'hover:bg-zinc-700'}`} onClick={() => setEngine('google')}>
                        <p className="text-xl poppins-regular">Google</p>
                    </div>
                    <div className={`w-full p-2 rounded ${engine === 'bing' ? 'bg-zinc-900' : 'hover:bg-zinc-700'}`} onClick={() => setEngine('bing')}>
                        <p className="text-xl poppins-regular">Bing</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full justify-self-center col-span-4 flex flex-row overflow-y-hidden">
                <div className="h-full w-1/3 grid grid-rows-3 p-4 text-white items-center bg-zinc-700 shadow-right">
                    <div className="flex flex-col w-full">
                        {Object.values(guideInfo[engine]).map((info, index) => {
                            return (
                                <div
                                    className="w-full p-2 rounded hover:bg-zinc-800 hover:shadow-xl"
                                    onClick={() => setSelectedOperator(index)}
                                >
                                    <p className="text-xl poppins-regular">
                                        {info.operator}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="text-white overflow-y-scroll w-full h-full p-4">
                    {Object.values(guideInfo[engine]).map((info) => {
                        return (<Card operator={info.operator} description={info.description}/>)
                    })}
                </div>
            </div>
        </div>
    );
}
