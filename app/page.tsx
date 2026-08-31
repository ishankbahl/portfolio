import { resume } from '@/lib/resume'
import { TextLink } from './components/TextLink'

export default function Home() {
  const { person } = resume

  return (
    <>
      <main id="main" className="mx-auto w-full max-w-[38rem] px-6 py-20 sm:py-28">
        <section>
          <h1 className="text-name font-semibold tracking-tight">{person.name}</h1>
          <p className="mt-4 text-lead">{person.positioning}</p>
          <p className="mt-3 text-meta text-muted">{person.location}</p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <TextLink href={person.resumePdf} download>
                Download resume
              </TextLink>
            </li>
            <li>
              <TextLink href={`mailto:${person.email}`}>Email me</TextLink>
            </li>
            <li>
              <TextLink href={person.github} external>
                GitHub
              </TextLink>
            </li>
          </ul>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-[38rem] px-6 pb-20" />
    </>
  )
}
