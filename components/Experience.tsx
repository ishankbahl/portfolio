import type { Education, ExperienceEntry } from '@/lib/resume'
import { Section } from './Section'
import { TextLink } from './TextLink'

export function Experience({
  experience,
  education,
}: {
  experience: ExperienceEntry[]
  education: Education
}) {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-4">
        {experience.map((role, index) => (
          // Index keys because this list is static and never reorders. Content
          // derived keys collide the day two lines share a prefix, and a
          // duplicate key warning would fail the no-console-errors test on an
          // edit that only touched copy.
          <li
            key={index}
            className="rounded-xl border border-border bg-card px-5 py-4 sm:px-6 sm:py-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-medium">{role.company}</h3>
              <p className="text-meta text-muted">{role.period}</p>
            </div>
            <p className="text-meta text-muted">{role.title}</p>

            {/*
              Markers, because without them the gap between items is smaller
              than the leading inside a wrapped item and the list stops reading
              as a list. Worst at 360 px, where items run to three lines.
            */}
            <ul className="mt-3 list-outside list-disc space-y-2 ps-5 marker:text-accent">
              {role.lines.map((line, lineIndex) => (
                <li key={lineIndex} className="text-body">
                  {line}
                </li>
              ))}
            </ul>

            {role.link ? (
              <p className="mt-3 text-meta">
                <TextLink href={role.link.url} external>
                  {role.link.label}
                </TextLink>
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-meta text-muted">
        {education.degree}. {education.institution}, {education.year}.
      </p>
    </Section>
  )
}
