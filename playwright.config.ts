import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure", // Auto-screenshot failed tests for debugging
  },
  webServer: [
    {
      command: "pnpm --filter server dev",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter web dev",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
