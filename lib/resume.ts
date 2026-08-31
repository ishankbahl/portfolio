import data from '@/content/resume.json'

export interface Person {
  name: string
  headline: string
  positioning: string
  location: string
  email: string
  github: string
  linkedin: string
  resumePdf: string
  siteUrl: string
}

export interface ExternalLink {
  label: string
  url: string
}

export interface ExperienceEntry {
  company: string
  title: string
  /**
   * Display copy, not a date pair. Formatting "2019-06" and a null end date in a
   * component is the one branch ADR 0002 says would earn a unit layer, so the
   * string lives in the content file and the components stay logic free.
   */
  period: string
  lines: string[]
  link?: ExternalLink
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface Education {
  degree: string
  institution: string
  year: number
}

export interface Resume {
  person: Person
  intro: string[]
  experience: ExperienceEntry[]
  skills: SkillGroup[]
  education: Education
}

// Annotated rather than asserted, so a shape drift in the json fails typecheck
// instead of failing in the browser.
export const resume: Resume = data
