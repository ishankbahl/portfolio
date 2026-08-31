import { personJsonLd } from '@/lib/person-json-ld'
import { resume } from '@/lib/resume'
import { Section } from './components/Section'
import { TextLink } from './components/TextLink'

export default function Home() {
  const { person, intro, experience, skills, education } = resume

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd() }} />
      <main id="main" className="mx-auto w-full max-w-[38rem] px-6 py-20 sm:py-28">
        <section>
          <h1 className="text-name font-semibold tracking-tight">{person.name}</h1>
          <p className="mt-4 text-lead">{person.positioning}</p>
          <p className="mt-3 text-meta text-muted">{person.location}</p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <TextLink href={person.resumePdf} download>
                Download resume
              </TextLink>
            </li>
            <li>
              <TextLink href={`mailto:${person.email}`}>Email me</TextLink>
            </li>
            <li>
              <TextLink href={person.github} external>
                GitHub
              </TextLink>
            </li>
          </ul>
        </section>

        <Section title="What I work on">
          <div className="space-y-4">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <ol className="space-y-8">
            {experience.map((role) => (
              <li key={role.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-medium">{role.company}</h3>
                  <p className="text-meta text-muted">{role.period}</p>
                </div>
                <p className="text-meta text-muted">{role.title}</p>
                {/*
                  Markers, because without them the gap between items is smaller
                  than the leading inside a wrapped item and the list stops
                  reading as a list. Worst at 360 px, where items run to three
                  lines.
                */}
                <ul className="mt-3 list-outside list-disc space-y-2 ps-5 marker:text-muted">
                  {role.lines.map((line) => (
                    <li key={line.slice(0, 40)} className="text-body">
                      {line}
                    </li>
                  ))}
                </ul>
                {role.link ? (
                  <p className="mt-2 text-meta">
                    <TextLink href={role.link.url} external>
                      {role.link.label}
                    </TextLink>
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-meta text-muted">
            {education.degree}. {education.institution}, {education.year}.
          </p>
        </Section>

        <Section title="Skills">
          <dl className="space-y-4">
            {skills.map((group) => (
              <div key={group.group}>
                <dt className="text-meta text-muted">{group.group}</dt>
                <dd className="text-body">{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </main>

      <footer className="mx-auto w-full max-w-[38rem] px-6 pb-20">
        <h2 className="sr-only">Contact</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-8">
          <li>
            <TextLink href={`mailto:${person.email}`}>Email</TextLink>
          </li>
          <li>
            <TextLink href={person.linkedin} external>
              LinkedIn
            </TextLink>
          </li>
          <li>
            <TextLink href={person.github} external>
              GitHub
            </TextLink>
          </li>
          <li>
            <TextLink href={person.resumePdf} download>
              Resume
            </TextLink>
          </li>
        </ul>
      </footer>
    </>
  )
}
