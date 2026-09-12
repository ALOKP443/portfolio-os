"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Cursor, Typewriter } from "./typewriter"
import { profile } from "@/lib/portfolio-data"

const ASCII_LOGO = String.raw`
  ____   ___  ____ _____ _____ ___  _     ___ ___    ___  ____
 |  _ \ / _ \|  _ \_   _|  ___/ _ \| |   |_ _/ _ \  / _ \/ ___|
 | |_) | | | | |_) || | | |_ | | | | |    | | | | || | | \___ \
 |  __/| |_| |  _ < | | |  _|| |_| | |___ | | |_| || |_| |___) |
 |_|    \___/|_| \_\|_| |_|   \___/|_____|___\___(_)\___/|____/
`

type Line = { text: string; status?: "ok" | "info" | "ready" }

const BOOT_LINES: Line[] = [
  { text: "PORTFOLIO.OS v2.4.1 [GDG-JIIT Edition]", status: "info" },
  { text: "Initializing system kernel .......................", status: "ok" },
  { text: "Loading user profile ............................. 80%", status: "ok" },
  { text: "Loading projects ................................. 100%", status: "ok" },
  { text: "Loading skills ................................... 100%", status: "ok" },
  { text: "System ready.", status: "ready" },
  { text: "ACCESS GRANTED.", status: "ready" },
]

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleChecks, setVisibleChecks] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }

  const skip = () => {
    if (skipped) return
    setSkipped(true)
    finish()
  }

  // Reveal system boot sequence lines with brief per-line delay (~3s total duration)
  useEffect(() => {
    if (skipped) return
    if (visibleChecks >= BOOT_LINES.length) {
      const t = setTimeout(() => setShowLogo(true), 200)
      return () => clearTimeout(t)
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const delay = reduce ? 40 : visibleChecks === 0 ? 150 : 260
    const t = setTimeout(() => setVisibleChecks((n) => n + 1), delay)
    return () => clearTimeout(t)
  }, [visibleChecks, skipped])

  useEffect(() => {
    if (showLogo && !showWelcome) {
      const t = setTimeout(() => setShowWelcome(true), 350)
      return () => clearTimeout(t)
    }
  }, [showLogo, showWelcome])

  return (
    <motion.button
      type="button"
      onClick={skip}
      aria-label="Skip boot sequence and enter terminal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="crt-flicker block h-full w-full cursor-pointer overflow-y-auto p-4 text-left font-mono text-sm text-term sm:p-8"
    >
      <div className="mx-auto max-w-3xl space-y-2">
        <div className="space-y-1">
          {BOOT_LINES.slice(0, visibleChecks).map((line, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3">
              <span className={line.status === "ready" ? "font-bold text-glow text-term" : "text-term-dim"}>
                {line.text}
              </span>
              {line.status === "ok" ? (
                <span className="text-glow text-term">[ OK ]</span>
              ) : line.status === "ready" ? (
                <span className="text-glow-strong text-term">[ OK ]</span>
              ) : (
                <span className="text-glow text-term">[ SYS ]</span>
              )}
            </div>
          ))}
        </div>

        {showLogo && (
          <motion.pre
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="text-glow-strong mt-4 overflow-x-auto text-[8px] leading-tight text-term sm:text-xs"
          >
            {ASCII_LOGO}
          </motion.pre>
        )}

        {showWelcome && (
          <div className="mt-4 space-y-1 text-term">
            <Typewriter
              text={`> session initialized for ${profile.name.toLowerCase()}@${profile.host}`}
              speed={14}
              showCursor={false}
            />
            <div>
              <Typewriter
                text="> type 'help' for interactive terminal commands."
                speed={14}
                startDelay={400}
                showCursor={false}
                onDone={() => setTimeout(finish, 500)}
              />
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-term-faint">
          [press any key, tap or click to skip boot animation]
          <Cursor />
        </div>
      </div>
    </motion.button>
  )
}
