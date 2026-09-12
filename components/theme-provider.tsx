"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export const THEMES = ["green", "amber", "blue"] as const
export type TerminalTheme = (typeof THEMES)[number]

export const THEME_LABELS: Record<TerminalTheme, string> = {
  green: "green phosphor",
  amber: "amber",
  blue: "hacker blue",
}

type ThemeContextValue = {
  theme: TerminalTheme
  setTheme: (t: TerminalTheme) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "terminal-theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<TerminalTheme>("green")

  // Rehydrate persisted choice on mount.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (saved && THEMES.includes(saved as TerminalTheme)) {
      setThemeState(saved as TerminalTheme)
    }
  }, [])

  const setTheme = (t: TerminalTheme) => {
    setThemeState(t)
    try {
      window.localStorage.setItem(STORAGE_KEY, t)
    } catch {
      // storage may be unavailable; state still updates for the session.
    }
  }

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTerminalTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTerminalTheme must be used within ThemeProvider")
  return ctx
}
