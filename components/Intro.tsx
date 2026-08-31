import { Section } from './Section'

export function Intro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Section id="what-i-work-on" title="What I work on">
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          // Index keys: static list, never reorders. See Experience.tsx.
          <p key={index} className="text-body">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  )
}
