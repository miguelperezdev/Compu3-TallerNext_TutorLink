/** Paginación de la API: limit/skip (defaults del backend: 10 / 0). */
export interface PageParams {
    limit?: number;
    skip?: number;
}

/** Resultado de paginar en memoria (ver lib/pagination.ts). */
export interface PageResult<T> {
    items: T[];
    current: number;
    totalPages: number;
    total: number;
}
