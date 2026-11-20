import "server-only";
import { redirect } from "next/navigation";
import { isApiError } from "./api";
import { ROUTES } from "./routes";

/**
 * Úsalo en el `catch` de una página/componente que llama a la API:
 *
 *   try { return await getTutors(token) } catch (e) { handleApiError(e, "/tutores") }
 *
 * - 401 -> sesión vencida: limpia cookies y va al login (route handler).
 * - cualquier otro error se relanza para que lo atrape `error.tsx`.
 */
export function handleApiError(error: unknown, from: string): never {
    if (isApiError(error) && error.status === 401) {
        redirect(`${ROUTES.sessionExpired}?from=${encodeURIComponent(from)}`);
    }
    throw error;
}
