import { Experience } from '@/components/Experience'
import { Hero } from '@/components/Hero'
import { Intro } from '@/components/Intro'
import { SelectedWork } from '@/components/SelectedWork'
import { Skills } from '@/components/Skills'
import { personJsonLd } from '@/lib/person-json-ld'
import { resume } from '@/lib/resume'

export default function Home() {
  const { person, intro, selectedWork, experience, skills, education } = resume

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd() }} />

      {/* Focusable so the skip link can move focus here. See tests/skip-link.spec.ts. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <div className="mx-auto w-full max-w-page px-6 pt-16 pb-24 sm:pt-20">
          <Hero
            person={person}
            lead={person.positioning}
            experience={experience}
            education={education}
          />
        </div>

        {/*
          One band with its own surface. Without it every section sits on the
          same background at the same width and the page reads as one document.
        */}
        <div className="band">
          <div className="mx-auto w-full max-w-page px-6 pt-4 pb-24">
            <Intro paragraphs={intro} />
            <Skills skills={skills} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-page px-6 pt-4 pb-24">
          <SelectedWork cards={selectedWork} />
          <Experience experience={experience} />
        </div>
      </main>
    </>
  )
}
