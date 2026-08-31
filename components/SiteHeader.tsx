import type { Person } from '@/lib/resume'

const SECTIONS = [
  { id: 'what-i-work-on', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
]

/**
 * Sticky, so the name and the resume action stay reachable while reading. The
 * backdrop blur is behind a solid fallback because `backdrop-filter` is the one
 * property here that is not universally supported.
 */
export function SiteHeader({ person }: { person: Person }) {
  const initials = person.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-6 py-3">
        {/* Not a link. There is one page, so it would navigate nowhere and only
            add a tab stop competing with the skip link. */}
        <p className="flex items-center gap-2.5 font-medium">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-lg bg-accent text-[0.7rem] font-semibold text-on-accent"
          >
            {initials}
          </span>
          <span className="text-meta sm:text-body">{person.name}</span>
        </p>

        <nav aria-label="Sections" className="flex items-center gap-4 sm:gap-6">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="hidden text-meta text-muted transition-colors hover:text-fg sm:inline"
            >
              {section.label}
            </a>
          ))}
          <a
            href={person.resumePdf}
            download
            className="rounded-full border border-border px-3 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  )
}
