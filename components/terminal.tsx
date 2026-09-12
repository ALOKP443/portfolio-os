"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Cursor, TypedLines } from "./typewriter"
import { WhoamiSection } from "./sections/whoami"
import { SkillsSection } from "./sections/skills"
import { ProjectsSection } from "./sections/projects"
import { EducationSection } from "./sections/education"
import { ContactSection } from "./sections/contact"
import { THEMES, THEME_LABELS, useTerminalTheme, type TerminalTheme } from "./theme-provider"
import { profile, projects } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

type Entry = {
  id: number
  command: string
  node: ReactNode
}

const PROMPT = `${profile.handle}@${profile.host}:~$`

// Commands exposed in mobile quick menu & help
const MENU_COMMANDS = [
  { input: "about", label: "about", hint: "whoami" },
  { input: "skills", label: "skills", hint: "tech stack" },
  { input: "projects", label: "projects", hint: "indexed works" },
  { input: "education", label: "education", hint: "academic info" },
  { input: "contact", label: "contact", hint: "social & msg" },
  { input: "theme", label: "theme", hint: "switch color" },
  { input: "matrix", label: "matrix", hint: "digital rain" },
  { input: "help", label: "help", hint: "all commands" },
  { input: "clear", label: "clear", hint: "reset screen" },
]

/** Small keyboard key pill */
function Kbd({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "mx-0.5 inline-flex min-w-5 items-center justify-center rounded border px-1 transition-all duration-150 font-mono text-[11px]",
        active
          ? "text-glow scale-110 border-term bg-term/20 text-term"
          : "border-term-faint text-term-dim",
      )}
    >
      {children}
    </span>
  )
}

export function Terminal() {
  const { theme, setTheme, cycleTheme } = useTerminalTheme()
  const reduce = useReducedMotion()
  const [history, setHistory] = useState<Entry[]>([])
  const [input, setInput] = useState("")
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const [minimized, setMinimized] = useState(false)
  const [activeKey, setActiveKey] = useState<"up" | "down" | null>(null)
  const idRef = useRef(0)
  const greetedRef = useRef(false)
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  const push = useCallback((command: string, node: ReactNode) => {
    setHistory((h) => [...h, { id: idRef.current++, command, node }])
  }, [])

  const buildResponse = useCallback(
    (raw: string): ReactNode => {
      const cmd = raw.trim()
      const lower = cmd.toLowerCase()

      // 1. help
      if (lower === "help" || lower === "?") {
        return (
          <div className="space-y-2 text-sm font-mono">
            <p className="text-term-dim">portfolio.os available commands:</p>
            <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 border border-term-faint bg-term-panel/40 p-3">
              {[
                ["about / whoami", "view profile & background"],
                ["skills / ls skills", "view tech stack & skills"],
                ["projects / cat projects.log", "list indexed projects"],
                ["open <01-04>", "expand project details inline"],
                ["education", "academic credentials & courses"],
                ["contact", "contact form & social links"],
                ["theme [green|amber|blue]", "switch terminal color"],
                ["matrix", "trigger falling digital rain"],
                ["clear", "clear scrollback output"],
                ["sudo make coffee", "brew developer coffee ☕"],
              ].map(([c, d]) => (
                <div key={c} className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-term font-semibold text-xs sm:text-sm">{c}</span>
                  <span className="hidden sm:inline text-term-faint">—</span>
                  <span className="text-term-dim text-xs">{d}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // 2. about / whoami
      if (lower === "about" || lower === "whoami") {
        return <WhoamiSection />
      }

      // 3. skills / ls skills
      if (
        lower === "skills" ||
        lower === "ls skills" ||
        lower === "ls skills/" ||
        lower === "ls"
      ) {
        return <SkillsSection />
      }

      // 4. projects / cat projects.log
      if (
        lower === "projects" ||
        lower === "cat projects.log" ||
        lower === "cat projects" ||
        lower === "ls projects" ||
        lower === "ls projects/"
      ) {
        return <ProjectsSection />
      }

      // 5. open <num>
      if (lower.startsWith("open ") || lower.startsWith("cat ")) {
        const target = lower.replace(/^(open|cat)\s+/, "").trim()
        // Check if matching project number like 01, 02, 1, 2 or project id
        const found = projects.find(
          (p) =>
            p.num === target ||
            p.num === target.padStart(2, "0") ||
            p.id === target ||
            p.file.toLowerCase().includes(target)
        )
        if (found) {
          return <ProjectsSection activeNum={found.num} />
        }
        return (
          <TypedLines
            onType={scrollToBottom}
            lines={[
              `project entry not found: '${target}'`,
              "usage: open 01  (or 02, 03, 04)",
              "type 'projects' to view the indexed list.",
            ]}
          />
        )
      }

      // 6. education
      if (lower === "education" || lower === "edu" || lower === "academics") {
        return <EducationSection />
      }

      // 7. contact
      if (lower === "contact" || lower === "contact --send" || lower === "socials") {
        return <ContactSection />
      }

      // 8. theme [name]
      if (lower.startsWith("theme")) {
        const arg = lower.split(/\s+/)[1] as TerminalTheme | "next" | undefined
        if (arg && (THEMES as readonly string[]).includes(arg)) {
          setTheme(arg as TerminalTheme)
          return (
            <TypedLines
              onType={scrollToBottom}
              lines={[`[SYS] Theme updated -> ${THEME_LABELS[arg as TerminalTheme]}`]}
            />
          )
        }
        if (arg === "next" || arg === undefined) {
          cycleTheme()
          return <TypedLines onType={scrollToBottom} lines={["[SYS] Cycling terminal phosphor color..."]} />
        }
        return (
          <TypedLines
            onType={scrollToBottom}
            lines={[
              `Available themes: ${THEMES.join(" | ")}`,
              `Usage: theme green  (or amber, blue)`,
            ]}
          />
        )
      }

      // 9. matrix
      if (lower === "matrix") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("trigger-matrix"))
        }
        return (
          <TypedLines
            onType={scrollToBottom}
            lines={[
              "[SYS] Initializing high-density Matrix neural rain overlay...",
              "Entering digital rain mode (4s)...",
            ]}
          />
        )
      }

      // 10. sudo make coffee
      if (lower === "sudo make coffee" || lower === "make coffee") {
        return (
          <TypedLines
            onType={scrollToBottom}
            lines={[
              "☕ Coffee.exe initialized.",
              "Productivity +47%",
              "System temperature optimal. Happy coding!",
            ]}
          />
        )
      }

      // Sudo default response
      if (lower.startsWith("sudo")) {
        return (
          <TypedLines
            onType={scrollToBottom}
            lines={[`${profile.handle} is not in the sudoers file. This incident will be reported.`]}
          />
        )
      }

      // Echo
      if (lower.startsWith("echo ")) {
        return <TypedLines onType={scrollToBottom} lines={[cmd.slice(5).trim()]} />
      }

      // Date
      if (lower === "date") {
        return <TypedLines onType={scrollToBottom} lines={[new Date().toString()]} />
      }

      if (cmd === "") return null

      // Unrecognized command
      return (
        <TypedLines
          onType={scrollToBottom}
          lines={[`command not found: ${cmd}`, "Type 'help' for available commands."]}
        />
      )
    },
    [cycleTheme, setTheme, scrollToBottom],
  )

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (cmd.toLowerCase() === "clear") {
        setHistory([])
        setInput("")
        return
      }
      const node = buildResponse(cmd)
      push(cmd, node)
      if (cmd) setCmdHistory((h) => [...h, cmd])
      setHistIndex(-1)
      setInput("")
    },
    [buildResponse, push],
  )

  const flashKey = (dir: "up" | "down") => {
    setActiveKey(dir)
    if (keyTimer.current) clearTimeout(keyTimer.current)
    keyTimer.current = setTimeout(() => setActiveKey(null), 320)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      run(input)
      return
    }
    // Command history navigation with Up/Down arrows
    if (e.key === "ArrowUp") {
      e.preventDefault()
      flashKey("up")
      if (cmdHistory.length === 0) return
      const next = histIndex < 0 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1)
      setHistIndex(next)
      setInput(cmdHistory[next])
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      flashKey("down")
      if (histIndex < 0) return
      const next = histIndex + 1
      if (next >= cmdHistory.length) {
        setHistIndex(-1)
        setInput("")
      } else {
        setHistIndex(next)
        setInput(cmdHistory[next])
      }
    }
  }

  // Auto-scroll to newest output
  useEffect(() => {
    scrollToBottom()
  }, [history, scrollToBottom])

  useEffect(() => {
    return () => {
      if (keyTimer.current) clearTimeout(keyTimer.current)
    }
  }, [])

  // Initial welcome message
  useEffect(() => {
    if (greetedRef.current) return
    greetedRef.current = true
    push(
      "",
      <TypedLines
        onType={scrollToBottom}
        lines={[
          "PORTFOLIO.OS v2.4.1 initialized.",
          "Type 'help' for available commands, or select a quick option below.",
        ]}
      />,
    )
  }, [push, scrollToBottom])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const themeButtons = useMemo(() => THEMES, [])
  const bodySpring = reduce
    ? { duration: 0.2 }
    : ({ type: "spring", stiffness: 300, damping: 30 } as const)

  return (
    <div className="flex h-full flex-col font-mono">
      {/* Window title bar */}
      <div className="flex items-center justify-between border-b border-term-faint px-3 py-1.5 text-xs text-term-dim bg-term-panel/40">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setHistory([])}
            aria-label="Clear terminal"
            title="Clear scrollback"
            className="h-2.5 w-2.5 rounded-full transition-transform hover:scale-125 focus:ring-1 focus:ring-term"
            style={{ backgroundColor: "#ff5f57" }}
          />
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Minimize terminal"
            title="Minimize"
            className="h-2.5 w-2.5 rounded-full transition-transform hover:scale-125 focus:ring-1 focus:ring-term"
            style={{ backgroundColor: "#febc2e" }}
          />
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label="Restore terminal"
            title="Restore"
            className="h-2.5 w-2.5 rounded-full transition-transform hover:scale-125 focus:ring-1 focus:ring-term"
            style={{ backgroundColor: "#28c840" }}
          />
          <span className="ml-2 hidden sm:inline text-term font-semibold">{PROMPT} portfolio.os</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-term-faint sm:inline text-xs">theme:</span>
          {themeButtons.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              aria-label={`Switch to ${THEME_LABELS[t]} theme`}
              aria-pressed={theme === t}
              title={THEME_LABELS[t]}
              className={`h-4 w-4 rounded-full border transition-all hover:scale-110 focus:outline-none focus:ring-1 focus:ring-term ${
                theme === t ? "border-term ring-1 ring-term scale-110" : "border-term-faint"
              }`}
              style={{
                backgroundColor:
                  t === "green" ? "#3dff74" : t === "amber" ? "#ffb642" : "#5cd6ff",
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {minimized ? (
          <motion.div
            key="dock"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={bodySpring}
            className="flex flex-1 items-center justify-center p-6"
          >
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="group flex items-center gap-2 border border-term-faint bg-term-panel/50 px-4 py-2 text-sm text-term transition-colors hover:border-term focus:ring-1 focus:ring-term"
            >
              <span className="text-term-dim transition-transform group-hover:-translate-y-0.5">
                ▲
              </span>
              reopen portfolio.os terminal
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="body"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={bodySpring}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Scrollback Output Area */}
            <div ref={scrollRef} onClick={focusInput} className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
              <div className="mx-auto max-w-3xl space-y-4">
                <AnimatePresence initial={false}>
                  {history.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: reduce ? 0 : -6, filter: "blur(2px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={
                        reduce ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 26 }
                      }
                      className="space-y-2"
                    >
                      {entry.command !== "" && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-term-dim font-bold">{PROMPT}</span>
                          <span className="text-term font-semibold">{entry.command}</span>
                        </div>
                      )}
                      {entry.node}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Command Pills + Command Input Bar */}
            <div className="border-t border-term-faint bg-term-panel/30 px-3 py-2 sm:px-4 space-y-2">
              <div className="mx-auto max-w-3xl space-y-2">
                {/* Mobile / Quick Command Buttons Bar */}
                <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {MENU_COMMANDS.map((c) => (
                    <button
                      key={c.input}
                      type="button"
                      onClick={() => run(c.input)}
                      aria-label={`Execute command ${c.input}`}
                      className="border border-term-faint bg-term-panel/60 px-2 py-1 text-xs text-term transition-all hover:border-term hover:bg-term/10 active:bg-term active:text-term-bg focus:ring-1 focus:ring-term shrink-0"
                    >
                      <span className="text-term-dim">$ </span>
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Command Input Box */}
                <label className="flex items-center gap-2 text-sm">
                  <span className="shrink-0 font-bold text-term-dim">{PROMPT}</span>
                  <span className="relative flex flex-1 items-center">
                    <input
                      ref={inputRef}
                      autoFocus
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      spellCheck={false}
                      autoComplete="off"
                      autoCapitalize="off"
                      aria-label="Terminal command input"
                      placeholder="type command..."
                      className="w-full bg-transparent text-term caret-transparent outline-none placeholder:text-term-faint/50"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute"
                      style={{ left: `${input.length}ch` }}
                    >
                      <Cursor />
                    </span>
                  </span>
                </label>

                <p className="hidden sm:flex flex-wrap items-center gap-x-1 text-[11px] text-term-faint">
                  tip: use <Kbd active={activeKey === "up"}>↑</Kbd> <Kbd active={activeKey === "down"}>↓</Kbd> for history · try <span className="text-term-dim font-semibold">projects</span>, <span className="text-term-dim font-semibold">open 01</span>, or <span className="text-term-dim font-semibold">sudo make coffee</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
