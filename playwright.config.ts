import { defineConfig, devices } from '@playwright/test'

// Set BASE_URL to point the same five tests at the deployed site after a release.
// Unset, they run against out/ behind serve, which is also what CI does.
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
const usingLocalBuild = !process.env.BASE_URL

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // next start refuses to run under output: 'export', so the suite needs a static
  // server. It is not incidental: test 2 asserts a content type, and a content type
  // comes from whatever serves the file. --no-port-switching so a busy port fails
  // loudly instead of serving the tests a different port than they request.
  ...(usingLocalBuild
    ? {
        webServer: {
          command: 'pnpm exec serve out --listen 3000 --no-clipboard --no-port-switching',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }
    : {}),
})
