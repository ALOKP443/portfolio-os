"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useTerminalTheme, THEME_LABELS } from "./theme-provider"

function useMetricDrift(min: number, max: number, initial: number, intervalMs: number) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    const id = setInterval(() => {
      setValue((current) => {
        // Smooth random drift step between -12 and +12
        const delta = (Math.random() - 0.5) * 24
        const next = Math.round(current + delta)
        return Math.max(min, Math.min(max, next))
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [min, max, intervalMs])

  return value
}

function Bar({ label, value }: { label: string; value: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="w-8 font-mono text-term-dim uppercase">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-[1px] border border-term-faint bg-term-panel/50">
        <motion.div
          className="absolute inset-y-0 left-0 bg-term"
          style={{ boxShadow: "0 0 6px rgba(var(--glow), 0.7)" }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 90, damping: 20, mass: 0.8 }
          }
        />
      </div>
      <span className="w-9 text-right font-mono tabular-nums text-term">{value}%</span>
    </div>
  )
}

/**
 * Live ambient system monitor. CPU, MEM, and NET fluctuate within realistic bounds
 * (CPU 15-60%, MEM 40-75%, NET 10-95%) every 2.5–3.5s with spring transition animation.
 */
export function SystemMonitor() {
  const { theme } = useTerminalTheme()
  const cpu = useMetricDrift(15, 60, 28, 2800)
  const mem = useMetricDrift(40, 75, 54, 3200)
  const net = useMetricDrift(10, 95, 38, 2400)
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = String(Math.floor(uptime / 3600)).padStart(2, "0")
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0")
  const ss = String(uptime % 60).padStart(2, "0")

  return (
    <div className="flex flex-col gap-1.5 font-mono text-[11px] leading-tight sm:text-xs">
      <div className="flex items-center justify-between gap-4 text-term-dim">
        <span className="text-glow text-term font-semibold">◉ portfolio.os</span>
        <span className="hidden sm:inline">sys_theme: {THEME_LABELS[theme]}</span>
        <span className="text-term-dim">
          up <span className="tabular-nums text-term">{hh}:{mm}:{ss}</span>
        </span>
      </div>
      <div className="grid gap-1 sm:grid-cols-3 sm:gap-4">
        <Bar label="cpu" value={cpu} />
        <Bar label="mem" value={mem} />
        <Bar label="net" value={net} />
      </div>
    </div>
  )
}
