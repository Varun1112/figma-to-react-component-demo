import { z } from "zod"

export const ComponentSchemaZod = z.object({
  component: z.string(),
  slots: z.array(z.string()),
  variants: z.array(z.string()),
  tokensUsed: z.array(z.string())
})

export type ComponentSchema = z.infer<typeof ComponentSchemaZod>
