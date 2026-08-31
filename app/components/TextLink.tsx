import type { ReactNode } from 'react'

/**
 * The only link style on the page. External links get target and rel here so
 * no caller has to remember, and the underline moves to the accent on hover so
 * colour is never the only thing carrying the state.
 */
export function TextLink({
  href,
  children,
  external = false,
  download = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
  download?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...(download ? { download: true } : {})}
      className="text-accent underline decoration-border decoration-1 underline-offset-4 transition-[text-decoration-color] hover:decoration-accent"
    >
      {children}
    </a>
  )
}
