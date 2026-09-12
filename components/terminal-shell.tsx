"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ThemeProvider, useTerminalTheme } from "./theme-provider"
import { CrtOverlay } from "./crt-overlay"
import { MatrixRain } from "./matrix-rain"
import { SystemMonitor } from "./system-monitor"
import { BootSequence } from "./boot-sequence"
import { Terminal } from "./terminal"

const SCRAMBLE = "01<>/\\{}[]#$%&*=+アカサタナﾊﾋﾌ01ABCDEF".split("")
function scrambleLine(n: number) {
  let s = ""
  for (let i = 0; i < n; i++) s += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
  return s
}

function ThemeGlitch() {
  const { theme } = useTerminalTheme()
  const reduce = useReducedMotion()
  const [burst, setBurst] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setBurst((b) => b + 1)
  }, [theme])

  if (reduce) return null

  return (
    <AnimatePresence>
      {burst > 0 && (
        <motion.div
          key={burst}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-center gap-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, times: [0, 0.12, 0.4, 0.6, 1] }}
        >
          <div className="absolute inset-0 bg-term/[0.06]" />
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="text-glow-strong overflow-hidden whitespace-nowrap text-sm text-term sm:text-base font-mono"
              initial={{ x: 0 }}
              animate={{ x: [0, -10, 8, -4, 0] }}
              transition={{ duration: 0.45 }}
            >
              {scrambleLine(160)}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ShellInner() {
  const { theme } = useTerminalTheme()
  const reduce = useReducedMotion()
  const [booted, setBooted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  // Allow "press any key" or tap/click to skip boot sequence
  useEffect(() => {
    if (booted) return
    const onKey = () => setBooted(true)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [booted])

  // Mouse cursor radial glow & subtle background parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const { clientX, clientY, currentTarget } = e
    const { width, height } = currentTarget.getBoundingClientRect()
    const xPct = (clientX / width) * 100
    const yPct = (clientY / height) * 100
    setMousePos({ x: xPct, y: yPct })

    // Subtle parallax offset (-4px to +4px)
    const px = ((clientX / width) - 0.5) * 8
    const py = ((clientY / height) - 0.5) * 8
    setParallax({ x: px, y: py })
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      className={`theme-${theme} relative flex h-[100svh] w-full flex-col overflow-hidden bg-term-bg text-term font-mono selection:bg-term/30 selection:text-term`}
    >
      {/* Soft radial cursor glow effect following mouse */}
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--glow), 0.08), transparent 80%)`,
          }}
        />
      )}

      {/* Subtle parallax background layer */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{
          transform: reduce ? "none" : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        <MatrixRain />
      </div>

      <CrtOverlay />

      {/* Main content layer */}
      <div className="crt-chroma relative z-20 flex h-full flex-col">
        <ThemeGlitch />
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div
              key="boot"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <BootSequence onComplete={() => setBooted(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="os"
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="crt-flicker flex h-full flex-col"
            >
              <header className="shrink-0 border-b border-term-faint px-3 py-2 sm:px-4 bg-term-bg/80 backdrop-blur-xs">
                <div className="mx-auto max-w-3xl">
                  <SystemMonitor />
                </div>
              </header>
              <div className="min-h-0 flex-1">
                <Terminal />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export function TerminalShell() {
  return (
    <ThemeProvider>
      <ShellInner />
    </ThemeProvider>
  )
}
