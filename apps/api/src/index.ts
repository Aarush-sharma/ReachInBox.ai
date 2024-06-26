import { authorize, getMessages } from "@repo/store/index";
import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.get("/", async (req, res) => {

  const newclient = await authorize()
  const data = await getMessages(newclient) 
  console.log(typeof data)
  res.json({ data });

});

app.post("/", async (req, res) => {
  const { key, data }: { key: string, data: string } = req.body;

});

const httpServer = app.listen(8081, () => console.log("server running on port 8081..."));

/**
 * 
 * 
 *import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from "@google/generative-ai";
import {} from "dotenv/config"
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(req:NextRequest) {
  const {prompt,history}:{prompt:string,history:Content[]} = await req.json()
  console.log(prompt,history)
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: history,
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text())
  return NextResponse.json(result.response.text());
}


 */