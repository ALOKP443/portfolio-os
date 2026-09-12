"use client"

import { GlitchHeading } from "../glitch-heading"
import { profile } from "@/lib/portfolio-data"

export function WhoamiSection() {
  const meta: [string, string][] = [
    ["user", profile.name],
    ["role", profile.role],
    ["school", profile.university],
    ["degree", profile.degree],
    ["location", profile.location],
  ]

  return (
    <section className="space-y-4 font-mono">
      <GlitchHeading>whoami --verbose</GlitchHeading>

      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[7rem_1fr] border border-term-faint bg-term-panel/40 p-3">
        {meta.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-term-dim uppercase text-xs tracking-wider">{k}:</dt>
            <dd className="text-term font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-1 border-l-2 border-term-faint pl-3 text-sm text-term">
        {profile.bio.map((line, i) => (
          <p key={i} className="leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      <div className="text-sm border border-term-faint bg-term-panel/30 p-3 space-y-1.5">
        <p className="text-xs font-bold uppercase text-term-dim tracking-wider"># Core Interests & Focus</p>
        <ul className="space-y-1">
          {profile.interests.map((it) => (
            <li key={it} className="text-term text-xs sm:text-sm">
              <span className="text-term-dim">→ </span>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
