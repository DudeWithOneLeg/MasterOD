import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Result from "../Result";

// import './index.css'

export default function Results({setPreview, preview, showResult, setShowResult}) {
  const data = useSelector((state) => state.search.results);



  useEffect(() => {
    // console.log("Data:", data);
  }, [data]);

  return (
    data &&
    Object.values(data).length > 0 && (
      //KEEP CLASS NAME AS IS
      <div className={`flex flex-col justify-center h-full overflow-y-scroll overflow-x-hidden px-2 ${showResult ? 'w-full' : 'w-100'}`} id='results'>

        <div className="rounded flex-col flex h-full py-2 w-full" id='inner-result'>
          {Object.keys(data).map((rowKey) => {
            return <Result rowKey={rowKey} data={data} showResult={showResult} setShowResult={setShowResult} setPreview={setPreview}/>
          })}
        </div>

      </div>
    )
  );
}
