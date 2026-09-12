"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Cursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("cursor-blink ml-0.5 inline-block h-[1.05em] w-[0.6em] translate-y-[0.12em] bg-term", className)}
    />
  )
}

type TypewriterProps = {
  text: string
  speed?: number
  startDelay?: number
  showCursor?: boolean
  className?: string
  onDone?: () => void
}

/**
 * Types out a single string character-by-character.
 * Respects prefers-reduced-motion by rendering instantly.
 */
export function Typewriter({
  text,
  speed = 18,
  startDelay = 0,
  showCursor = true,
  className,
  onDone,
}: TypewriterProps) {
  const [out, setOut] = useState("")
  const [done, setDone] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduce) {
      setOut(text)
      setDone(true)
      onDoneRef.current?.()
      return
    }

    let i = 0
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setOut(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
          onDoneRef.current?.()
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return (
    <span className={className}>
      {out}
      {showCursor && !done && <Cursor />}
    </span>
  )
}

type TypedLinesProps = {
  lines: string[]
  speed?: number
  className?: string
  onType?: () => void
  onDone?: () => void
}

/**
 * Types a block of lines out character-by-character with a trailing cursor,
 * used for terminal command responses so they "print" instead of popping in.
 * `onType` fires on every tick so the parent can keep the view scrolled.
 * Respects prefers-reduced-motion by rendering the whole block instantly.
 */
export function TypedLines({ lines, speed = 12, className, onType, onDone }: TypedLinesProps) {
  const full = lines.join("\n")
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const onTypeRef = useRef(onType)
  const onDoneRef = useRef(onDone)
  onTypeRef.current = onType
  onDoneRef.current = onDone

  useEffect(() => {
    if (reduce) {
      setCount(full.length)
      setDone(true)
      onDoneRef.current?.()
      return
    }
    setCount(0)
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      onTypeRef.current?.()
      if (i >= full.length) {
        clearInterval(id)
        setDone(true)
        onDoneRef.current?.()
      }
    }, speed)
    return () => clearInterval(id)
  }, [full, speed, reduce])

  const rows = full.slice(0, count).split("\n")

  return (
    <div className={cn("space-y-0.5 text-sm text-term", className)}>
      {rows.map((row, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">
          {row}
          {!done && i === rows.length - 1 && <Cursor />}
        </div>
      ))}
    </div>
  )
}
