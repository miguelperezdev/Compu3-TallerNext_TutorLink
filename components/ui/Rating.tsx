import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn } from "@/lib/cn";

/** Estrellas de solo lectura (1 a 5). */
export function Stars({ value, className }: { value: number; className?: string }) {
    const rounded = Math.round(value);
    return (
        <span
            className={cn("inline-flex gap-0.5 text-warning-500", className)}
            role="img"
            aria-label={`${value.toFixed(1)} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((n) => (n <= rounded ? <IoStar key={n} /> : <IoStarOutline key={n} />))}
        </span>
    );
}

/** "★ 4.8 (15)" compacto para tarjetas. Sin reseñas muestra "Nuevo". */
export function RatingSummary({ average, count }: { average: number; count: number }) {
    if (count === 0) {
        return <span className="text-xs font-medium text-ink-muted">Sin reseñas aún</span>;
    }
    return (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
            <IoStar className="text-warning-500" aria-hidden />
            {average.toFixed(1)}
            <span className="font-normal text-ink-muted">({count})</span>
        </span>
    );
}
