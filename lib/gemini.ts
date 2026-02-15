import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY not set")
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function callGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  })

  return response.text ?? ""
}
