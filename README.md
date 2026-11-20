# TutorLink — Frontend

Marketplace web de tutorías universitarias (Computación en Internet 3 · 2026-2). Frontend en **Next.js 16 (App Router)** que
consume la API NestJS del repositorio `Compu3-TallerNest_TutorLink`.

**Equipo:** Miguel Pérez, Johan Suarez, Juan Sebastián Rodríguez Legarda.

## Inicio rápido
```bash
pnpm install
cp .env.example .env.local      # API_URL (Render por defecto)
pnpm dev                        # http://localhost:3000
```

| Script | Para qué |
|---|---|
| `pnpm dev` | Desarrollo (Turbopack) |
| `pnpm build` / `pnpm start` | Producción |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript |

## Stack
Next.js 16.4 · React 19.3 · TypeScript · Tailwind CSS 4 · axios (solo servidor) · react-icons · pnpm.
Mismas decisiones del curso: Server Components por defecto, Server Actions, `proxy.ts`, `"use cache"` con tags, route groups.

## Qué incluye hoy
Landing, login/registro, shell responsive por rol (estudiante/tutor/admin), inicio del estudiante, búsqueda de tutores con filtros
y paginación, perfil de tutor con reseñas. Las demás pantallas (reservas, panel del tutor, administración) existen como stubs (`ComingSoon`) pendientes de implementar.

## Variables de entorno
| Variable | Alcance | Descripción |
|---|---|---|
| `API_URL` | Solo servidor | URL base del backend, con prefijo `/tutorlink` |
