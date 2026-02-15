import fs from "fs"
import { normalizeComponent } from "../figma/normalizeComponent"
import { resolveTokens } from "../figma/resolveTokens"
import { runAgent1 } from "../agent-1/run"

async function main() {
  // 1️⃣ Read raw Figma mock
  const raw = JSON.parse(
    fs.readFileSync("mock-data/figma/button.primary.json", "utf-8")
  )

  // 2️⃣ Normalize
  const normalized = normalizeComponent(raw)

  // 3️⃣ Load token map
  const tokenMap = JSON.parse(
    fs.readFileSync(
      "mock-data/tokens/figma-style-to-token.json",
      "utf-8"
    )
  )

  // 4️⃣ Resolve tokens
  const tokenized = resolveTokens(normalized, tokenMap)

  // 5️⃣ Run Agent 1
  await runAgent1(tokenized)
}

main()
