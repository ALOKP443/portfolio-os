"use client"

import { GlitchHeading } from "../glitch-heading"
import { education } from "@/lib/portfolio-data"

export function EducationSection() {
  return (
    <section className="space-y-4 font-mono">
      <GlitchHeading>education --details</GlitchHeading>

      <div className="border border-term-faint bg-term-panel/40 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-term-faint pb-2">
          <div>
            <h3 className="text-base font-bold text-term">{education.institution}</h3>
            <p className="text-sm text-term-dim">
              {education.degree} — {education.branch}
            </p>
          </div>
          <div className="text-right text-xs text-term-dim">
            <div>{education.duration}</div>
            <div className="text-term font-semibold">GPA: {education.gpa}</div>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-xs text-term-dim font-bold uppercase tracking-wider"># Key Coursework</p>
          <div className="grid gap-1 sm:grid-cols-2 text-xs text-term">
            {education.coursework.map((course) => (
              <div key={course} className="flex items-center gap-1.5">
                <span className="text-term-dim">▪</span>
                <span>{course}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-sm pt-1">
          <p className="text-xs text-term-dim font-bold uppercase tracking-wider"># Honors & Community</p>
          <ul className="space-y-0.5 text-xs text-term">
            {education.achievements.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-term-dim">★</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
