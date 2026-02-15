import fs from "fs"
import path from "path"
import { buildAgent2Prompt } from "./prompt";
import { validateGeneratedComponent } from "../validators/astValidator"
import { askGemini } from "../lib/gemini"

async function callLLM(prompt: string): Promise<string> {
  return  await askGemini(prompt).then(value => value)
}


export async function runAgent2(schemaPath: string) {
  const schema = JSON.parse(
    fs.readFileSync(schemaPath, "utf-8")
  )

  const prompt = buildAgent2Prompt(schema)
  const code = await callLLM(prompt)

  const outputDir = path.join(process.cwd(), "components")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  const filePath = path.join(
    outputDir,
    `${schema.component}.tsx`
  )

  fs.writeFileSync(filePath, code.trim())

  // 🔒 AST VALIDATION
  try {
    validateGeneratedComponent(filePath, schema)
    console.log(`✅ Agent2 generated valid ${filePath}`)
  } catch (error) {
    fs.unlinkSync(filePath)
    throw error
  }
}

