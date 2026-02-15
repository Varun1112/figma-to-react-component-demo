import fs from "fs"
import path from "path"
import { buildAgent1Prompt } from "./prompt"
import { ComponentSchemaZod } from "./schema"
import { askGemini } from "../lib/gemini"

async function callLLM(prompt: string): Promise<string> {
  return  await askGemini(prompt).then(value => value)
}

export async function runAgent1(componentData: any) {

  // 2️⃣ Define allowed components (hard guardrail)
  const allowedComponents = ["Button", "Input", "Link"]

  // 3️⃣ Build prompt
  const prompt = buildAgent1Prompt({
    componentData,
    allowedComponents
  })

  // 4️⃣ Call LLM
 let raw = await callLLM(prompt)

// Remove markdown code fences if present
raw = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

let parsed

try {
  parsed = JSON.parse(raw)
} catch (err) {
  console.error("Raw Gemini response:\n", raw)
  throw new Error("❌ Agent1 returned invalid JSON")
}


  const schema = ComponentSchemaZod.parse(parsed)

  // 6️⃣ Persist output
  const outputDir = path.join(process.cwd(), "agent1/output")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(
    outputDir,
    `${schema.component}.schema.json`
  )

  fs.writeFileSync(
    outputPath,
    JSON.stringify(schema, null, 2)
  )

  console.log(`✅ Agent1 schema written to ${outputPath}`)

  return schema
}
