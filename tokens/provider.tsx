import React, { createContext, useContext } from "react"

import baseTokens from "./base.json"

type Tokens = typeof baseTokens

const TokenContext = createContext<Tokens>(baseTokens)

export function TokensProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <TokenContext.Provider value={baseTokens}>
      {children}
    </TokenContext.Provider>
  )
}

export function useTokens(component: string) {
  const tokens = useContext(TokenContext)
  return tokens[component as keyof Tokens]
}
