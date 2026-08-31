import type { SkillGroup } from '@/lib/resume'
import { Section } from './Section'

/**
 * Pills, not bars. SPEC.md bans percentage bars and star ratings because they
 * assert a precision nobody can defend. A pill is just the word with a border
 * round it, which claims nothing.
 */
export function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-5">
        {skills.map((group) => (
          <div key={group.group}>
            <dt className="text-meta text-muted">{group.group}</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-3 py-1 text-meta"
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
