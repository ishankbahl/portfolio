import type { ReactNode } from 'react'

/**
 * A titled page section.
 *
 * Owns the one spacing rule the design depends on: the gap between sections is
 * much larger than any gap inside them. Split across call sites, that drifts.
 *
 * `aria-labelledby` is what makes this a landmark. An unnamed `section` is
 * exposed to assistive tech as a generic element, so without it the "landmark
 * elements" line in SPEC.md would not be true.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  const headingId = `${id}-heading`

  return (
    <section id={id} aria-labelledby={headingId} className="mt-20">
      <h2 id={headingId} className="text-meta font-medium tracking-[0.14em] text-muted uppercase">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
