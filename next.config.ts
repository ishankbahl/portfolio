import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prerender to plain files. There is no server in production, which is also
  // why next/image is banned in CLAUDE.md: it emits /_next/image URLs nothing answers.
  output: 'export',
}

export default nextConfig
