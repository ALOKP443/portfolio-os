"use client"

import { useState, type FormEvent } from "react"
import { GlitchHeading } from "../glitch-heading"
import { socials } from "@/lib/portfolio-data"

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    setStatus("sending")
    // Simulated transmit — wire to a real endpoint/Server Action as needed.
    setTimeout(() => setStatus("sent"), 1200)
  }

  const field =
    "w-full border border-term-faint bg-term-panel/40 px-2 py-1.5 text-sm text-term outline-none placeholder:text-term-faint focus:border-term-dim"

  return (
    <section className="space-y-4">
      <GlitchHeading>contact --send</GlitchHeading>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-term underline decoration-term-faint underline-offset-4 transition-colors hover:decoration-term"
          >
            <span className="text-term-dim">{s.label}: </span>
            {s.value}
          </a>
        ))}
      </div>

      {status === "sent" ? (
        <p className="border border-term-faint bg-term-panel/40 p-3 text-sm text-term">
          <span className="text-glow">✔ message transmitted.</span> thanks for
          reaching out — I&apos;ll reply soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-2">
          <label className="block text-sm">
            <span className="text-term-dim">name:</span>
            <input
              required
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="visitor"
            />
          </label>
          <label className="block text-sm">
            <span className="text-term-dim">email:</span>
            <input
              required
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@domain.com"
            />
          </label>
          <label className="block text-sm">
            <span className="text-term-dim">message:</span>
            <textarea
              required
              rows={3}
              className={field}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="type your message..."
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="border border-term-dim bg-term-panel px-3 py-1.5 text-sm text-term transition-colors hover:bg-term hover:text-term-bg disabled:opacity-60"
          >
            {status === "sending" ? "transmitting..." : "$ send --now"}
          </button>
        </form>
      )}
    </section>
  )
}
