import type { ReactNode } from 'react'

/**
 * `aria-labelledby` is what makes this a landmark. An unnamed `section` is
 * exposed to assistive tech as a generic element.
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
    <section id={id} aria-labelledby={headingId} className="mt-24">
      <h2 id={headingId} className="text-section font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}
