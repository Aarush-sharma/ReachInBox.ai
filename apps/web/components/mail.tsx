import { clearSymbols } from "@/app/page";
import { useState } from "react";
import {
  prequisiteModelData,
  prequisiteUserData,
} from "../components/gemini.config";
import axios from "axios";
interface data {
  data: string;

  index: number;
}
interface content {
  role: string;
  parts: {
    text: string;
  }[];
}
export default function DataTable(props: data) {
  const [mail, setmail] = useState(false);
  const [data, setdata] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [Airesponse, setAIresponse] = useState("");
  const [history, setHistory] = useState<content[]>([]);
  const createChatResponse = async () => {
    const userMessage = { role: "user", parts: [{ text: data }] };
    setmail(true);
    setHistory([prequisiteUserData, prequisiteModelData, ...history]);

    try {
      console.log(history);
      const response = await axios.post("http://localhost:8081/", {
        prompt: data,
        history: history,
      });
      const modelValue = clearSymbols(response.data);
      const modelMessage = { role: "model", parts: [{ text: modelValue }] };

      setAIresponse(modelValue);
      setHistory([...history, userMessage, modelMessage]);
      console.log(history);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const validData = clearSymbols(props.data);
  const validres = Airesponse.replace(/\*\*/g, "").replace(/<br>/g, "\n");
  const title = props.data.startsWith("<!DOCTYPE html>")
    ? "html only mail. tap to open"
    : props.data.replace("[image: Google]", "").replace("*", "").split(".")[0] +
      "..";
  async function HandleSend() {
    const res = await axios.post("http://localhost:8081/send/", {
      to: to,
      subject: subject,
      data: data,
    });
    console.log(res.data);
  }
  return (
    <>
      {mail ? (
        <div className="h-full w-full flex">
          <div>
            {" "}
            email:
            <div
              className="border border-r border-white pl-1"
              dangerouslySetInnerHTML={{ __html: validData }}
            ></div>
          </div>

          <div className="w-full ">
            <input
              type="text"
              className="text-black"
              placeholder="to"
              onChange={(e) => setTo(e.target.value)}
            />
            <input
              type="text"
              className="text-black"
              placeholder="subject"
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className=" pl-1 w-full h-[90%] text-black"
              placeholder="generating ai response..."
              value={validres}
              onChange={(e) => setdata(e.target.value)}
            ></textarea>
            <button onClick={HandleSend}>send mail</button>
          </div>
        </div>
      ) : (
        <button
          onClick={createChatResponse}
          className=" h-[5vh] w-full border flex justify-start border-white"
        >
          {title ? title : props.data}
        </button>
      )}
    </>
  );
}
