import { resume } from './resume'

/**
 * A schema.org Person built from the same content file the page renders, so the
 * structured data cannot drift away from the visible text.
 */
export function personJsonLd(): string {
  const { person, education } = resume

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.headline,
    description: person.positioning,
    url: person.siteUrl,
    email: `mailto:${person.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: person.location,
    },
    sameAs: [person.github, person.linkedin],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: education.institution,
    },
  }

  // Escaping < keeps a closing script tag in any future content value from
  // ending the block early. None of this data contains one today.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
