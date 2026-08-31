import data from '@/content/resume.json'

export interface Photo {
  src: string
  width: number
  height: number
  alt: string
}

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
  photo: Photo
}

export interface ExternalLink {
  label: string
  url: string
}

export interface ExperienceEntry {
  company: string
  title: string
  /** Display copy, e.g. "Jun 2024 to present". Keeps date formatting out of components. */
  period: string
  lines: string[]
  link?: ExternalLink
}

export interface WorkCard {
  id: string
  company: string
  period: string
  problem: string
  whatIBuilt: string
  decision: string
  stack: string[]
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
  selectedWork: WorkCard[]
  experience: ExperienceEntry[]
  skills: SkillGroup[]
  education: Education
}

// Annotated, not asserted: a missing or retyped key fails typecheck. Extra keys
// still pass, which is the limit of this approach.
export const resume: Resume = data
