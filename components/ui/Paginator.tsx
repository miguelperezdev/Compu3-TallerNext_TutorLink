import Link from "next/link";
import { getPageNumbers } from "@/lib/pagination";
import { cn } from "@/lib/cn";

type PaginatorProps = {
    basePath: string;
    page: number;
    totalPages: number;
    /** Query a conservar en cada link (filtros, búsqueda...). */
    params?: Record<string, string>;
};

const base = "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors";
const linkCls = cn(base, "border border-line bg-surface text-ink-soft hover:bg-brand-50");
const currentCls = cn(base, "bg-brand-600 text-white");
const disabledCls = cn(base, "border border-line bg-canvas text-ink-muted");

function hrefFor(basePath: string, page: number, params: Record<string, string>) {
    const query = new URLSearchParams(params);
    if (page > 1) query.set("page", String(page));
    const search = query.toString();
    return search ? `${basePath}?${search}` : basePath;
}

export function Paginator({ basePath, page, totalPages, params = {} }: PaginatorProps) {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Paginación" className="flex flex-wrap items-center gap-1">
            {page > 1 ? (
                <Link href={hrefFor(basePath, page - 1, params)} aria-label="Página anterior" className={linkCls}>
                    ‹
                </Link>
            ) : (
                <span className={disabledCls}>‹</span>
            )}

            {getPageNumbers(page, totalPages).map((item, index) =>
                item === "..." ? (
                    <span key={`gap-${index}`} className="px-1 text-ink-muted">
                        …
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={hrefFor(basePath, item, params)}
                        aria-label={`Página ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        className={item === page ? currentCls : linkCls}
                    >
                        {item}
                    </Link>
                )
            )}

            {page < totalPages ? (
                <Link href={hrefFor(basePath, page + 1, params)} aria-label="Página siguiente" className={linkCls}>
                    ›
                </Link>
            ) : (
                <span className={disabledCls}>›</span>
            )}
        </nav>
    );
}
