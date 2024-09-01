"use client"

import axios from "axios";
import DataTable from "../components/mail";
import { Dispatch, SetStateAction, useState } from "react";
import { BackgroundGradientAnimation } from "@/components/bg";

interface messageresponse {
  data: string[];
}
interface content {
  role: string;
  parts: {
    text: string;
  }[];
}
export  const clearSymbols = (text: string): string => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\n/g, "<br>")
    .replace(
      /```(.*?)```/g,
      `<div  class=" bg-black mockup-code px-3">$1</div>`
    );
};
export interface emailPage {
  data: string;
  index: number;
}
function App() {
  const [data, setdata] = useState<string[]>([]);

  

  const [isfetched, setisfetched] = useState(false);
  const [numberofmails, setnumberofmails] = useState(1);
  const handleAuth = async () => {
    try {
      const res = await fetch("http://localhost:8081/");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = (await res.json()) as messageresponse;
      setdata(jsonData.data);
      setisfetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 



  const handleBack = () => {
    setisfetched(false);
  };
  const getMessages = async () => {
    const res = await axios("http://localhost:8081/", {
      params: {
        mailno: numberofmails,
      },
    });
    const data = res.data.data;
    setdata(data);
    console.log("this is new data", data);
    setisfetched(true);
  };
  return (
    <BackgroundGradientAnimation >
    <>
      {isfetched && (
        <div>
          <button onClick={handleBack}>go back</button>
          <div>
            <input
              type="number"
              placeholder="get more emails?"
              className="text-black"
              onChange={(e) => setnumberofmails(parseInt(e.target.value))}
            />
            <button onClick={getMessages}>go</button>
          </div>
        </div>
      )}
      {isfetched ? (
        data.map((val, index) => (
          <div key={index}>
            <DataTable
              
              index={index}
              data={val}
              
            ></DataTable>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex-col items-center">
            <h1 className="font-semibold text-4xl my-5 mb-5">welcome to outreach.ai</h1>
            <div className="flex justify-center">
            <button onClick={handleAuth} className="border border-white hover:bg-gray-950 rounded-lg px-2 py-2">connect</button>
            </div>
          </div>
        </div>
      )}
    </>
    </BackgroundGradientAnimation
    >
  );
}

export default App;
