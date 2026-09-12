"use client"

import { motion, useReducedMotion } from "framer-motion"
import { GlitchHeading } from "../glitch-heading"
import { skillCategories } from "@/lib/portfolio-data"

export function SkillsSection() {
  const reduce = useReducedMotion()

  return (
    <section className="space-y-4 font-mono">
      <GlitchHeading>ls skills/</GlitchHeading>

      <p className="text-xs text-term-dim">
        drwxr-xr-x {skillCategories.reduce((acc, cat) => acc + cat.items.length, 0)} items · ~/skills
      </p>

      <div className="space-y-4">
        {skillCategories.map((cat) => (
          <div key={cat.category} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-term-dim border-b border-term-faint pb-0.5">
              # {cat.category}
            </h3>
            <motion.div
              className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
              }}
            >
              {cat.items.map((s) => {
                const cells = 10
                const filled = Math.round((s.level / 100) * cells)
                return (
                  <motion.div
                    key={s.name}
                    variants={{
                      hidden: { opacity: 0, x: reduce ? 0 : -8 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: reduce
                          ? { duration: 0.15 }
                          : { type: "spring", stiffness: 320, damping: 26 },
                      },
                    }}
                    className="group flex flex-col gap-0.5 border border-term-faint bg-term-panel/40 p-2 transition-colors hover:border-term-dim"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-term font-semibold">
                        <span className="text-term-dim">$ </span>
                        {s.name}
                      </span>
                      <span className="text-xs text-term-dim tabular-nums">{s.level}%</span>
                    </div>
                    <div className="text-xs text-term" aria-hidden="true">
                      [{"▓".repeat(filled)}
                      <span className="text-term-faint">{"·".repeat(cells - filled)}</span>]
                    </div>
                    <p className="text-xs text-term-dim">{s.note}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
