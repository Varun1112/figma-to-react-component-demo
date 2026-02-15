# 🧠 AI-Driven Figma → React Component Generator

An experimental AI pipeline that converts **Figma design components** into **brand-aware React components** using **design tokens**, powered by **Gemini LLM** and protected by an **AST validation layer**.

This project demonstrates how to safely integrate AI into a design system workflow without sacrificing reliability.

---

# 📌 Table of Contents

1. Overview  
2. Architecture  
3. Pipeline Flow  
4. Project Structure  
5. Agents Explained  
6. Design Token System  
7. AST Validation Layer  
8. Setup Guide  
9. Execution Guide  
10. Negative Testing  
11. Safety Principles  
12. Future Improvements  

---

# 🚀 1. Overview

This system converts structured Figma output into production-safe React components.

Key goals:

- Enforce strict token usage
- Prevent AI hallucinated styling
- Separate reasoning from rendering
- Support multi-brand theming
- Validate AI output programmatically

---

# 🏗 2. High-Level Architecture

Figma JSON
↓
normalizeComponent.ts
↓
resolveTokens.ts
↓
Agent-1 (Gemini) → Component Schema
↓
Agent-2 (Gemini) → React Code
↓
AST Validator
↓
components/Button.tsx


---

# 🔄 3. Detailed Pipeline Flow

## Step 1 — Normalize Figma

Converts raw Figma JSON into structured format.

## Step 2 — Resolve Tokens

Maps Figma style references to design tokens.

Example:

"Primary/Brand" → "button.background"


## Step 3 — Agent-1 (Structure Reasoning)

Gemini analyzes component structure and outputs:

```json
{
  "component": "Button",
  "slots": ["label"],
  "variants": ["primary"],
  "tokensUsed": [
    "button.background",
    "button.textColor",
    "button.borderRadius"
  ]
}
```

## Steps to run the App
    1. Run npm install
    2. setup .env file with GEMINI_API_KEY= Your API Key
    3.npm run agent1
    4.npm run agent2

    Output will be a button react component

