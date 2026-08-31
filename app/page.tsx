import { resume } from '@/lib/resume'

export default function Home() {
  const { person } = resume

  return (
    <>
      <main id="main" className="mx-auto w-full max-w-[38rem] px-6 py-20 sm:py-28">
        <h1 className="text-name font-semibold tracking-tight">{person.name}</h1>
      </main>
      <footer className="mx-auto w-full max-w-[38rem] px-6 pb-20" />
    </>
  )
}
