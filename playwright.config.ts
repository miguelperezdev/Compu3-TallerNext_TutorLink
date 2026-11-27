import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra la app real + el backend NestJS (con datos del seed).
 *
 * Requisitos:
 *  - Backend levantado y `API_URL` en `.env.local` apuntando a él.
 *  - Usuarios del seed (clave `Secreta123`): ana@example.com (estudiante) y tutor1@example.com (tutor).
 *
 * Variables opcionales:
 *  - E2E_BASE_URL: usa una app ya desplegada/levantada en vez de arrancar `pnpm dev`.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
    testDir: "./e2e",
    // El flujo comparte datos con el backend (reservas del mismo tutor): se corre en serie.
    fullyParallel: false,
    workers: 1,
    timeout: 90_000,
    expect: { timeout: 15_000 },
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL,
        locale: "es-CO",
        timezoneId: "America/Bogota",
        trace: "retain-on-failure",
        screenshot: "only-on-failure"
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: process.env.E2E_BASE_URL
        ? undefined
        : {
              command: "pnpm dev",
              url: baseURL,
              reuseExistingServer: true,
              timeout: 120_000
          }
});
