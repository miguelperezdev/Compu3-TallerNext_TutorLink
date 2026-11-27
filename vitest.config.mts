import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: /^@\//, replacement: `${root}` },
            // `server-only` lanza fuera de React Server; en pruebas se reemplaza por un módulo vacío.
            { find: /^server-only$/, replacement: `${root}test/stubs/server-only.ts` }
        ]
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        include: ["**/*.test.{ts,tsx}"],
        exclude: ["node_modules/**", ".next/**", "e2e/**"]
    }
});
