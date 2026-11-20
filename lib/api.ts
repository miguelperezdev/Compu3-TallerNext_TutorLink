import "server-only";
import axios, { isAxiosError } from "axios";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Nest devuelve `message` como string o como string[] (errores de class-validator).
 * Siempre lo normalizamos a un solo texto.
 */
function normalizeMessage(data: unknown, fallback: string) {
    const message = (data as { message?: string | string[] } | undefined)?.message;
    if (Array.isArray(message)) return message.join(". ");
    return message ?? fallback;
}

export const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    // Render duerme el servicio si no hay tráfico: la primera petición puede tardar.
    timeout: 30_000
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error) && error.response) {
            return Promise.reject(
                new ApiError(error.response.status, normalizeMessage(error.response.data, error.message))
            );
        }
        return Promise.reject(error); // red caída, timeout, etc.
    }
);

/** Config de axios con el JWT en `Authorization: Bearer`. */
export function withAuth(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
}

/**
 * `instanceof` falla si el error cruza el límite de `"use cache"`;
 * comparamos por forma para no depender de la identidad de la clase.
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        error instanceof ApiError ||
        (error instanceof Error && error.name === "ApiError" && typeof (error as ApiError).status === "number")
    );
}

/**
 * Los errores lanzados DENTRO de una función `"use cache"` llegan al que llama como un
 * Error genérico (pierden la clase `ApiError` y el `status`). Por eso las funciones
 * cacheadas devuelven un `ApiResult` (datos planos, que sí cruzan el límite) y la
 * función pública lo "abre" con `unwrap`, ya fuera de la caché, relanzando un ApiError real.
 *
 * Solo los 4xx viajan como resultado (son respuestas "esperables": 401, 404, 409...).
 * Los 5xx y las caídas de red se relanzan: así NUNCA se cachea un fallo del servidor.
 */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

export async function toResult<T>(request: () => Promise<T>): Promise<ApiResult<T>> {
    try {
        return { ok: true, data: await request() };
    } catch (error) {
        if (isApiError(error) && error.status < 500) {
            return { ok: false, status: error.status, message: error.message };
        }
        throw error;
    }
}

export function unwrap<T>(result: ApiResult<T>): T {
    if (!result.ok) throw new ApiError(result.status, result.message);
    return result.data;
}
