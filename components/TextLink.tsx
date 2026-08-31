import type { ReactNode } from 'react'

/**
 * The only two link styles on the page.
 *
 * `text` carries a permanent underline in the accent colour. It used to
 * underline in the border colour, which is 1.25:1 against the background and
 * therefore invisible, which left colour as the only cue that something is a
 * link. The accent is 2.5:1 against body text, under the 3:1 WCAG requires when
 * colour is the sole indicator, so the underline is load bearing rather than
 * decorative. Hover deepens it.
 *
 * `button` is the filled variant, used once, for the primary action.
 *
 * External links get target, rel and a screen reader only warning here so no
 * caller has to remember any of it.
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
