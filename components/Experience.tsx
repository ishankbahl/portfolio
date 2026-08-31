import type { ExperienceEntry } from '@/lib/resume'
import { Section } from './Section'
import { TextLink } from './TextLink'

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-4">
        {experience.map((role, index) => (
          <li
            key={index}
            className="rounded-xl border border-border bg-card px-5 py-5 transition-colors hover:border-accent/50 sm:px-6"
          >
            {/* Period above the name, so a long company name cannot reflow the
                header into a different shape from the sibling cards. */}
            <p className="text-meta text-muted">{role.period}</p>
            <h3 className="mt-1 text-body font-medium">{role.company}</h3>
            <p className="text-meta text-muted">{role.title}</p>

            {/* Markers, or the item gap reads smaller than the leading inside a wrapped item. */}
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


    </Section>
  )
}
