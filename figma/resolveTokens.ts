// figma/resolveTokens.ts

type NormalizedComponent = {
  name: string
  layout: string
  children: string[]
  variants: string[]
  styles: {
    fills?: string
    text?: string
    borderRadius?: string
  }
}

type TokenMap = Record<string, string>

type TokenizedComponent = {
  name: string
  layout: string
  children: string[]
  variants: string[]
  resolvedTokens: Record<string, string>
}

export function resolveTokens(
  normalized: NormalizedComponent,
  tokenMap: TokenMap
): TokenizedComponent {
  const resolvedTokens: Record<string, string> = {}

  Object.entries(normalized.styles).forEach(([key, value]) => {
    if (!value) return

    const token = tokenMap[value]

    if (!token) {
      throw new Error(
        `❌ No token mapping found for Figma style: "${value}"`
      )
    }

    resolvedTokens[key] = token
  })

  return {
    name: normalized.name,
    layout: normalized.layout,
    children: normalized.children,
    variants: normalized.variants,
    resolvedTokens
  }
}
