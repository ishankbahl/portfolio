import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { resume } from '@/lib/resume'
import './globals.css'

/*
  Self hosted from a 47 kB latin subset in this repo rather than fetched from
  Google at build time, so no build of this site can go red because a font CDN
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

export const metadata: Metadata = {
  title: resume.person.name,
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
      </body>
    </html>
  )
}
