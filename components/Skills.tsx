import type { SkillGroup } from '@/lib/resume'
import { Section } from './Section'

export function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <Section id="skills" title="Skills">
      <dl className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.group}>
            <dt className="text-meta text-muted">{group.group}</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-3 py-1 text-meta transition-colors hover:border-accent"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
