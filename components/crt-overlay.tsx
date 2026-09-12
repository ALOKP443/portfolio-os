"use client"

/**
 * Pure-CSS CRT overlay: scanlines, vignette and a slow scan sweep.
 * Kept subtle so text stays readable. Sits above content but ignores pointer
 * events. The parent must be `position: relative`.
 */
export function CrtOverlay() {
  return (
    <div
      aria-hidden="true"
      className="crt-scanlines crt-vignette crt-sweep pointer-events-none absolute inset-0 z-30"
    />
  )
}
