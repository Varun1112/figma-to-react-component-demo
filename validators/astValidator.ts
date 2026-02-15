import fs from "fs"
import { parse } from "@babel/parser"

export function validateGeneratedComponent(
  filePath: string,
  schema: any
) {
  const code = fs.readFileSync(filePath, "utf-8")

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"]
  })

  validateImports(ast.program.body)
  validateTokenUsage(ast, schema)
  validateNoHardcodedStyles(ast)
}

function validateImports(body: any[]) {
  const allowedImports = ["react", "../tokens/provider"]

  body.forEach(node => {
    if (node.type === "ImportDeclaration") {
      const importPath = node.source.value
      if (!allowedImports.includes(importPath)) {
        throw new Error(
          `❌ Disallowed import detected: ${importPath}`
        )
      }
    }
  })
}

function validateTokenUsage(ast: any, schema: any) {
  const allowedTokens = schema.tokensUsed.map((t: string) =>
    t.split(".")[1]
  )

  traverse(ast, node => {
    if (
      node.type === "MemberExpression" &&
      node.object?.name === "tokens"
    ) {
      const tokenName = node.property?.name
      if (!allowedTokens.includes(tokenName)) {
        throw new Error(
          `❌ Invalid token used: ${tokenName}`
        )
      }
    }
  })
}

function validateNoHardcodedStyles(ast: any) {
  traverse(ast, node => {
    if (
      node.type === "StringLiteral" &&
      (node.value.includes("#") ||
        node.value.includes("px") ||
        node.value.includes("rgb"))
    ) {
      throw new Error(
        `❌ Hardcoded style detected: ${node.value}`
      )
    }
  })
}

function traverse(node: any, visitor: (node: any) => void) {
  visitor(node)

  for (const key in node) {
    const value = node[key]

    if (Array.isArray(value)) {
      value.forEach(child => {
        if (child && typeof child === "object") {
          traverse(child, visitor)
        }
      })
    } else if (value && typeof value === "object") {
      traverse(value, visitor)
    }
  }
}
