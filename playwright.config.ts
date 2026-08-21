import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  webServer: {
    command: "npm run preview -- --port 4321",
    url: "http://localhost:4321/mapizzaioli/",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:4321/mapizzaioli/" },
});
