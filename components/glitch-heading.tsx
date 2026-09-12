import { cn } from "@/lib/utils"

/**
 * Section heading with a CSS glitch effect on hover.
 * `data-text` feeds the ::before/::after glitch layers.
 */
export function GlitchHeading({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <h2
      data-text={children}
      className={cn(
        "glitch text-glow-strong text-base font-bold uppercase tracking-widest text-term sm:text-lg",
        className,
      )}
    >
      {children}
    </h2>
  )
}
