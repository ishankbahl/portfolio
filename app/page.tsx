import { Experience } from '@/components/Experience'
import { Hero } from '@/components/Hero'
import { Intro } from '@/components/Intro'
import { Skills } from '@/components/Skills'
import { SiteFooter } from '@/components/SiteFooter'
import { personJsonLd } from '@/lib/person-json-ld'
import { resume } from '@/lib/resume'

/**
 * Composition only. Every section reads from the same content file and this file
 * owns no markup of its own beyond the page column, so adding or reordering a
 * section is one line here.
 */
export default function Home() {
  const { person, intro, experience, skills, education } = resume

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd() }} />

      {/*
        tabIndex -1 so the skip link actually moves focus. main is not focusable
        by default, so activating the link moved the hash and left activeElement
        on body in both engines. Chromium masks that by continuing sequential
        focus from the fragment target anyway; WebKit does not, so in Safari the
        next Tab went back to the top. Covered by tests/skip-link.spec.ts.
      */}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[42rem] px-6 py-20 focus:outline-none sm:py-28"
      >
        <Hero person={person} />
        <Intro paragraphs={intro} />
        <Experience experience={experience} education={education} />
        <Skills skills={skills} />
      </main>

      <SiteFooter person={person} />
    </>
  )
}
