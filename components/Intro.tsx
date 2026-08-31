import { Section } from './Section'

export function Intro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Section id="what-i-work-on" title="What I work on">
      <div className="max-w-prose-measure space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-body">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  )
}
