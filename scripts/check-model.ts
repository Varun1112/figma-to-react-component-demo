import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
})

async function test() {
  const response = await ai.models.generateContent({
    model: "gemini-pro",
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello" }]
      }
    ]
  })

  console.log(response.text)
}

test()
