import type { ReactNode } from 'react'

/**
 * Holds the one rule the design depends on: the gap between sections is much
 * larger than any gap inside them. If that lives in three call sites it drifts.
 */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-20">
      <h2 className="text-meta font-medium tracking-[0.14em] text-muted uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
