import fs from "fs"
import { parse } from "@babel/parser"

/* ========================================================= */
/*                  MAIN VALIDATION ENTRY                    */
/* ========================================================= */

export function validateGeneratedComponent(
  filePath: string,
  schema: any
) {
  const code = fs.readFileSync(filePath, "utf-8")

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"]
  })

  const componentName = schema.component
  const namespace = componentName.toLowerCase()

  const allowedTokens = schema.tokensUsed.map((t: string) =>
    t.split(".")[1]
  )

  let useTokensCount = 0
  let namedExportFound = false

  traverse(ast, (node: any, parent: any) => {
    /* ---------------------------------- */
    /* 1. Import Enforcement              */
    /* ---------------------------------- */
    if (node.type === "ImportDeclaration") {
      const allowedImports = ["react", "../tokens/provider"]

      if (!allowedImports.includes(node.source.value)) {
        throw new Error(
          `❌ Disallowed import: ${node.source.value}`
        )
      }
    }

    /* ---------------------------------- */
    /* 2. No Default Export               */
    /* ---------------------------------- */
    if (node.type === "ExportDefaultDeclaration") {
      throw new Error("❌ Default export not allowed")
    }

    /* ---------------------------------- */
    /* 3. Named Export Must Match Schema  */
    /* ---------------------------------- */
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration?.id?.name === componentName
    ) {
      namedExportFound = true
    }

    /* ---------------------------------- */
    /* 4. useTokens Enforcement           */
    /* ---------------------------------- */
    if (
      node.type === "CallExpression" &&
      node.callee?.name === "useTokens"
    ) {
      useTokensCount++

      const arg = node.arguments[0]?.value

      if (arg !== namespace) {
        throw new Error(
          `❌ useTokens namespace must be "${namespace}"`
        )
      }
    }

    if (useTokensCount > 1) {
      throw new Error("❌ Multiple useTokens() calls not allowed")
    }

    /* ---------------------------------- */
    /* 5. No Bracket Token Access         */
    /* ---------------------------------- */
    if (
      node.type === "MemberExpression" &&
      node.computed === true
    ) {
      throw new Error("❌ Bracket token access not allowed")
    }

    /* ---------------------------------- */
    /* 6. Validate Token Usage            */
    /* ---------------------------------- */
    if (
      node.type === "MemberExpression" &&
      node.object?.name === "tokens"
    ) {
      const tokenName = node.property?.name

      if (!allowedTokens.includes(tokenName)) {
        throw new Error(
          `❌ Unauthorized token usage: ${tokenName}`
        )
      }
    }

    /* ---------------------------------- */
    /* 7. Context-Aware Style Literal Ban */
    /* ---------------------------------- */
    if (
      node.type === "ObjectProperty" &&
      isInsideJSXStyle(parent)
    ) {
      const value = node.value

      if (
        value?.type === "StringLiteral" ||
        value?.type === "NumericLiteral"
      ) {
        throw new Error(
          `❌ Hardcoded style detected: ${value.value}`
        )
      }
    }

    /* ---------------------------------- */
    /* 8. No console usage                */
    /* ---------------------------------- */
    if (
      node.type === "MemberExpression" &&
      node.object?.name === "console"
    ) {
      throw new Error("❌ console usage not allowed")
    }

    /* ---------------------------------- */
    /* 9. No Async Components             */
    /* ---------------------------------- */
    if (
      node.type === "FunctionDeclaration" &&
      node.async === true
    ) {
      throw new Error("❌ Async components not allowed")
    }
  })

  /* ---------------------------------- */
  /* Final Structural Checks            */
  /* ---------------------------------- */

  if (useTokensCount === 0) {
    throw new Error("❌ useTokens() must be called exactly once")
  }

  if (!namedExportFound) {
    throw new Error(
      `❌ Named export "${componentName}" not found`
    )
  }
}

/* ========================================================= */
/*                     SAFE AST TRAVERSAL                    */
/* ========================================================= */

function traverse(
  node: any,
  visitor: (node: any, parent: any) => void,
  parent: any = null
) {
  visitor(node, parent)

  for (const key in node) {
    if (
      key === "loc" ||
      key === "start" ||
      key === "end"
    )
      continue

    const value = node[key]

    if (Array.isArray(value)) {
      value.forEach(child => {
        if (child && typeof child === "object") {
          traverse(child, visitor, node)
        }
      })
    } else if (value && typeof value === "object") {
      traverse(value, visitor, node)
    }
  }
}

/* ========================================================= */
/*            CONTEXT CHECK: style={{ ... }}                 */
/* ========================================================= */

function isInsideJSXStyle(parent: any): boolean {
  if (!parent) return false

  return (
    parent.type === "JSXAttribute" &&
    parent.name?.name === "style"
  )
}
