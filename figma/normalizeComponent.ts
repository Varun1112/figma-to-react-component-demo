// figma/normalizeComponent.ts

type RawFigmaComponent = {
  name: string
  layout?: {
    direction?: string
  }
  children?: Array<{
    type: string
    name: string
  }>
  variants?: Record<string, string[]>
  styles?: {
    fills?: string
    text?: string
    borderRadius?: number
  }
}

type NormalizedComponent = {
  name: string
  layout: "HORIZONTAL" | "VERTICAL" | "NONE"
  children: string[]
  variants: string[]
  styles: {
    fills?: string
    text?: string
    borderRadius?: string
  }
}

export function normalizeComponent(
  figmaComponent: RawFigmaComponent
): NormalizedComponent {
  return {
    name: figmaComponent.name,

    layout: normalizeLayout(figmaComponent.layout),

    children: normalizeChildren(figmaComponent.children),

    variants: normalizeVariants(figmaComponent.variants),

    styles: normalizeStyles(figmaComponent.styles)
  }
}

// ---------- helpers ----------

function normalizeLayout(layout?: RawFigmaComponent["layout"]) {
  if (!layout?.direction) return "NONE"

  if (layout.direction === "HORIZONTAL") return "HORIZONTAL"
  if (layout.direction === "VERTICAL") return "VERTICAL"

  return "NONE"
}

function normalizeChildren(
  children?: RawFigmaComponent["children"]
): string[] {
  if (!children) return []

  return children.map(child => {
    if (child.type === "TEXT") return "label"
    if (child.type === "ICON") return "icon"
    return child.name.toLowerCase()
  })
}

function normalizeVariants(
  variants?: RawFigmaComponent["variants"]
): string[] {
  if (!variants) return []

  return Object.values(variants).flat()
}

function normalizeStyles(
  styles?: RawFigmaComponent["styles"]
): NormalizedComponent["styles"] {
  if (!styles) return {}

  return {
    fills: styles.fills,
    text: styles.text,
    borderRadius: styles.borderRadius ? "borderRadius" : undefined
  }
}
