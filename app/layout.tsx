import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { resume } from '@/lib/resume'
import './globals.css'

/*
  Self hosted from a 47 kB latin subset committed to this repo rather than
  fetched from Google at build time, so no build can go red because a font CDN
  was slow. adjustFontFallback overrides Arial's metrics to match Inter's, which
  is what holds layout shift at zero across the swap.
*/
const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: 'Arial',
})

const { person } = resume
const title = `${person.name}, ${person.headline}`

export const metadata: Metadata = {
  // metadataBase is what turns the relative og:image below into an absolute url.
  // A relative one passes a presence check and then renders no link preview.
  metadataBase: new URL(person.siteUrl),
  title,
  description: person.positioning,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: person.name,
    title,
    description: person.positioning,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    // No site handle on purpose. I am not putting a dormant one in a meta tag.
    card: 'summary_large_image',
    title,
    description: person.positioning,
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans text-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-bg focus:px-3 focus:py-2 focus:text-meta"
        >
          Skip to content
        </a>
        {children}
        {/*
          The only two client components on the page, and the only exceptions
          CLAUDE.md allows. Both fetch their script from /_vercel/, which the
          platform serves and this build does not contain, so they do nothing
          locally and 404 there. That is why tests/console.spec.ts skips
          /_vercel/ when it looks for failed requests.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
