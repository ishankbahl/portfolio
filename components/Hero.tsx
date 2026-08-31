import type { Person } from '@/lib/resume'
import { TextLink } from './TextLink'

/**
 * The headline sits in a marker highlight. It is `person.headline` from the
 * content file, which previously only reached the metadata title and never the
 * page, so this renders content that already existed rather than inventing any.
 */
export function Hero({ person }: { person: Person }) {
  return (
    <section aria-labelledby="name">
      <h1 id="name" className="text-name font-semibold tracking-tight">
        {person.name}
      </h1>

      <p className="mt-5 text-lead font-medium">
        <span className="marker">{person.headline}</span>
      </p>

      <p className="mt-4 max-w-[34rem] text-body text-muted">{person.positioning}</p>

      <p className="mt-4 text-meta text-muted">{person.location}</p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <TextLink href={person.resumePdf} download variant="button">
          Download resume
        </TextLink>
        <TextLink href={`mailto:${person.email}`}>Email me</TextLink>
        <TextLink href={person.github} external>
          GitHub
        </TextLink>
      </div>
    </section>
  )
}
