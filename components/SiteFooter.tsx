import type { Person } from '@/lib/resume'
import { TextLink } from './TextLink'

export function SiteFooter({ person }: { person: Person }) {
  return (
    <footer aria-labelledby="contact-heading" className="mx-auto w-full max-w-page px-6 pb-16">
      <h2 id="contact-heading" className="sr-only">
        Contact
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-8 text-meta">
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
  )
}
