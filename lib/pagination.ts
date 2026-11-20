import type { PageResult } from "@/interfaces/pagination.interface";

/** Pagina una lista en memoria (mismo enfoque que student-list.ts del curso). */
export function paginate<T>(items: T[], page: number, pageSize: number): PageResult<T> {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), current, totalPages, total };
}

/**
 * Números que pinta el Paginator, con "..." solo donde hay un hueco real.
 * (Corrige el bug documentado en el repo del curso.)
 */
export function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [...new Set([1, current - 1, current, current + 1, total])]
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b);

    return pages.flatMap((page, i) =>
        i > 0 && page - pages[i - 1] > 1 ? ["...", page] : [page]
    ) as (number | "...")[];
}

/** Convierte un searchParam (string | string[] | undefined) en string limpio. */
export function readParam(value: string | string[] | undefined): string {
    return typeof value === "string" ? value.trim() : "";
}

/** Entero positivo o el valor por defecto. */
export function readPositiveInt(value: string | string[] | undefined, fallback: number): number {
    const n = Number(readParam(value));
    return Number.isInteger(n) && n > 0 ? n : fallback;
}
