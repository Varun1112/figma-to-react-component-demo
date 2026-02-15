import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

// 1. MUST BE FIRST: Load your API Key
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 2. Use the name that appeared in your list
// 'gemini-2.5-flash' is the direct successor to 1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function askGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return "Error fetching AI response.";
  }
}