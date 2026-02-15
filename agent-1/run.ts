import fs from "fs"
import path from "path"
import { buildAgent1Prompt } from "./prompt"
import { ComponentSchemaZod } from "./schema"
import { callGemini } from "../lib/gemini"

async function callLLM(prompt: string): Promise<string> {
  return callGemini(prompt)
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
  const rawResponse = await callLLM(prompt)

  // 5️⃣ Parse + validate schema
  let parsed
  try {
    parsed = JSON.parse(rawResponse)
  } catch {
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
