import type { WorkCard } from '@/lib/resume'
import { Section } from './Section'
import { TextLink } from './TextLink'

/**
 * The three fields are deliberate. A problem gives the work stakes, what I built
 * says what is mine rather than the team's, and a decision with its cost is the
 * part a resume bullet cannot carry.
 */
export function SelectedWork({ cards }: { cards: WorkCard[] }) {
  return (
    <Section id="work" title="Selected work">
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.id}
            className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
          >
            <header>
              <p className="text-meta text-muted">{card.period}</p>
              <h3 className="mt-1 text-body font-semibold">{card.company}</h3>
            </header>

            <p className="mt-4 text-body">{card.problem}</p>

            <p className="mt-4 text-meta text-muted">{card.whatIBuilt}</p>

            <div className="mt-5 rounded-lg border-l-2 border-accent bg-bg px-4 py-3">
              <p className="text-meta font-medium text-accent">The decision, and what it cost</p>
              <p className="mt-1 text-meta text-muted">{card.decision}</p>
            </div>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {card.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[0.75rem] text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>

            {card.link ? (
              <p className="mt-4 text-meta">
                <TextLink href={card.link.url} external>
                  {card.link.label}
                </TextLink>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  )
}
