import { TextLink } from '@/components/TextLink'
import { resume } from '@/lib/resume'

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[42rem] px-6 py-20 sm:py-28">
      <h1 className="text-name font-semibold tracking-tight">Not found</h1>
      <p className="mt-5 text-body text-muted">
        There is one page on this site and this is not it.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <TextLink href="/" variant="button">
          Go to the page
        </TextLink>
        <TextLink href={resume.person.resumePdf} download>
          Download resume
        </TextLink>
      </div>
    </main>
  )
}
