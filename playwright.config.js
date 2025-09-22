// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list', { 
      printSteps: true,          // show steps for failed tests
      printFailuresOnly: true,   // only failed tests
      printSummary: true,        // summary at the end
      printErrorMessages: true,  // show error messages
      verbose: true               // full stack traces
    }],
    ['html', { open: 'never' }]
  ],

  use: {
    trace: 'on-first-retry', // trace capture for debugging
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
