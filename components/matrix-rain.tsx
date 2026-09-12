"use client"

import { useEffect, useRef, useState } from "react"
import { useTerminalTheme } from "./theme-provider"

const THEME_RGB: Record<string, [number, number, number]> = {
  green: [61, 255, 116],
  amber: [255, 182, 66],
  blue: [92, 214, 255],
}

const GLYPHS = "01<>[]{}/\\|=+*ｱｲｳｴｵｶｷｸ$#%&アカサタナ01ABCDEF".split("")

/**
 * Lightweight canvas matrix rain background.
 * Automatically intensifies opacity when a 'trigger-matrix' event is dispatched.
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTerminalTheme()
  const [intense, setIntense] = useState(false)

  // Listen for 'trigger-matrix' custom event from the terminal command
  useEffect(() => {
    const handleMatrix = () => {
      setIntense(true)
      const t = setTimeout(() => setIntense(false), 4500)
      return () => clearTimeout(t)
    }
    window.addEventListener("trigger-matrix", handleMatrix)
    return () => window.removeEventListener("trigger-matrix", handleMatrix)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []
    const fontSize = 16

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.floor(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -50)
      ctx.font = `${fontSize}px monospace`
    }

    setup()
    window.addEventListener("resize", setup)

    const [r, g, b] = THEME_RGB[theme] ?? THEME_RGB.green

    let raf = 0
    let last = 0
    const step = intense ? 35 : 55 // faster frame rate during matrix burst

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < step) return
      last = t

      // Fade previous frame for trail
      ctx.fillStyle = intense ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.09)"
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intense ? 0.95 : 0.85})`
        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -20
        drops[i] += 1
      }
    }

    if (!reduce) {
      raf = requestAnimationFrame(draw)
    } else {
      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fillRect(0, 0, width, height)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", setup)
    }
  }, [theme, intense])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ${
        intense ? "opacity-75 z-50" : "opacity-[0.10]"
      }`}
    />
  )
}
