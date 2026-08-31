import type { ReactNode } from 'react'

/**
 * The accent is 2.5:1 against body text, under the 3:1 WCAG asks when colour is
 * the only cue that something is a link, so the underline is load bearing.
 */
export function TextLink({
  href,
  children,
  external = false,
  download = false,
  variant = 'text',
}: {
  href: string
  children: ReactNode
  external?: boolean
  download?: boolean
  variant?: 'text' | 'button'
}) {
  const styles =
    variant === 'button'
      ? 'inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-meta font-medium text-on-accent transition-opacity hover:opacity-90'
      : 'text-accent underline decoration-accent/40 decoration-1 underline-offset-4 transition-[text-decoration-color] hover:decoration-accent'

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...(download ? { download: true } : {})}
      className={styles}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}
