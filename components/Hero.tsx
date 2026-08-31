import type { Education, ExperienceEntry, Person } from '@/lib/resume'
import { TextLink } from './TextLink'

/**
 * Two columns from `sm` up. Without this the page is one narrow text column at
 * every width, which reads as a formatted document rather than a page.
 */
export function Hero({
  person,
  lead,
  experience,
  education,
}: {
  person: Person
  lead: string
  experience: ExperienceEntry[]
  education: Education
}) {
  const current = experience[0]
  const sdk = experience.find((role) => role.link)?.link

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="grid gap-10 sm:grid-cols-[1.35fr_1fr] sm:gap-12"
      >
      <div>
        <p className="text-meta font-medium tracking-[0.14em] text-accent uppercase">
          {person.headline}
        </p>

        <h1 id="hero-heading" className="mt-4 text-name font-semibold tracking-tight">
          {person.name}
        </h1>

        <p className="mt-5 max-w-prose-measure text-lead text-fg">{lead}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <TextLink href={person.resumePdf} download variant="button">
            Download resume
          </TextLink>
          <TextLink href={`mailto:${person.email}`}>Email me</TextLink>
          <TextLink href={person.github} external>
            GitHub
          </TextLink>
        </div>
      </div>

      <div>
        {/*
          Plain img, not next/image: see the Images section of SPEC.md. width and
          height are the real intrinsic dimensions, which is what reserves the
          box and holds CLS at zero.

          This is the LCP element, so it loads eagerly with fetchpriority high.
          The lazy default in CLAUDE.md is for images below the fold; lazy
          loading the largest element above it would delay the metric it is
          meant to protect.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image is banned, see SPEC.md Images */}
        <img
          src={person.photo.src}
          width={person.photo.width}
          height={person.photo.height}
          alt={person.photo.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full rounded-xl border border-border object-cover"
        />

        </div>
      </section>

      {/*
        A horizontal strip rather than a card in the right column. Stacked under
        the photo it pushed the right column far below the left and left a void
        beside it.
      */}
      <dl className="mt-12 grid gap-x-8 gap-y-5 border-t border-border pt-6 text-meta sm:grid-cols-4">
        <div>
          <dt className="text-muted">Currently</dt>
          <dd className="mt-1 text-body font-medium">{current?.company}</dd>
          <dd className="text-muted">{current?.title}</dd>
        </div>
        <div>
          <dt className="text-muted">Based in</dt>
          <dd className="mt-1 text-body">{person.location}</dd>
        </div>
        <div>
          <dt className="text-muted">Studied</dt>
          <dd className="mt-1 text-body">{education.degree}</dd>
          <dd className="text-muted">{education.year}</dd>
        </div>
        {sdk ? (
          <div>
            <dt className="text-muted">Open source</dt>
            <dd className="mt-1">
              <TextLink href={sdk.url} external>
                {sdk.label}
              </TextLink>
            </dd>
          </div>
        ) : null}
      </dl>
    </>
  )
}
