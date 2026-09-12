"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { GlitchHeading } from "../glitch-heading"
import { projects } from "@/lib/portfolio-data"

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

type ProjectsSectionProps = {
  activeNum?: string // e.g., "01", "02", "03", "04"
  onSelectProject?: (num: string) => void
}

export function ProjectsSection({ activeNum, onSelectProject }: ProjectsSectionProps) {
  const [open, setOpen] = useState<string | null>(activeNum ?? null)
  const reduce = useReducedMotion()
  const spring = reduce
    ? { duration: 0.2 }
    : ({ type: "spring", stiffness: 260, damping: 30 } as const)

  const toggle = (num: string) => {
    const next = open === num ? null : num
    setOpen(next)
    if (onSelectProject && next) onSelectProject(next)
  }

  return (
    <section className="space-y-4 font-mono">
      <GlitchHeading>cat projects.log</GlitchHeading>
      <p className="text-xs text-term-dim">
        {projects.length} indexed entries · type <span className="text-term font-semibold">&apos;open 01&apos;</span> or click an entry to expand inline
      </p>

      <div className="divide-y divide-term-faint border border-term-faint">
        {projects.map((p) => {
          const isOpen = open === p.num || open === p.id
          return (
            <div key={p.num} className="bg-term-panel/30">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(p.num)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-term transition-colors hover:bg-term-panel"
              >
                <motion.span
                  className="text-term-dim shrink-0"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={spring}
                >
                  ▶
                </motion.span>
                <span className="font-bold text-glow text-term shrink-0">[{p.num}]</span>
                <span className="text-term-dim shrink-0 hidden sm:inline">{p.file}</span>
                <span className="truncate text-term font-semibold">{p.title}</span>
                <span className="ml-auto shrink-0 text-xs text-term-faint">{p.year}</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={spring}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-3 pb-3 pl-7 text-sm border-t border-term-faint/50 pt-2">
                      <p className="text-term font-medium leading-relaxed">{p.summary}</p>
                      <div className="space-y-1 border-l-2 border-term-faint pl-3 text-term-dim text-xs sm:text-sm">
                        {p.details.map((d, i) => (
                          <p key={i} className="leading-relaxed">
                            • {d}
                          </p>
                        ))}
                      </div>

                      <motion.div
                        className="flex flex-wrap gap-1.5 pt-1"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
                        }}
                      >
                        {p.stack.map((tag) => (
                          <motion.span
                            key={tag}
                            variants={{
                              hidden: { opacity: 0, y: reduce ? 0 : 4, scale: reduce ? 1 : 0.9 },
                              show: { opacity: 1, y: 0, scale: 1, transition: spring },
                            }}
                            className="border border-term-faint bg-term-panel px-1.5 py-0.5 text-xs text-term"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>

                      {(p.repo || p.link) && (
                        <div className="flex flex-wrap gap-4 pt-1.5 text-xs">
                          {p.repo && (
                            <a
                              href={p.repo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-term-dim transition-colors hover:text-term hover:underline"
                            >
                              <GithubIcon /> [source repo]
                            </a>
                          )}
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-term-dim transition-colors hover:text-term hover:underline"
                            >
                              <LinkIcon /> [live demo]
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
