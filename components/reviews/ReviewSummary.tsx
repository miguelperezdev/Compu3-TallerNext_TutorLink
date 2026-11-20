import { Stars } from "@/components/ui/Rating";
import type { Review } from "@/interfaces/review.interface";

/** Promedio grande + barras de distribución 5★…1★ (como el historial del prototipo). */
export function ReviewSummary({ average, count, reviews }: { average: number; count: number; reviews: Review[] }) {
    const distribution = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        total: reviews.filter((r) => r.rating === stars).length
    }));

    return (
        <div className="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-5 shadow-card">
            <div className="text-center">
                <p className="text-5xl font-extrabold">{average.toFixed(1)}</p>
                <Stars value={average} className="mt-1 justify-center" />
                <p className="mt-1 text-xs text-ink-muted">
                    {count} {count === 1 ? "reseña" : "reseñas"}
                </p>
            </div>
            <ul className="min-w-48 flex-1 space-y-1.5">
                {distribution.map(({ stars, total }) => (
                    <li key={stars} className="flex items-center gap-2 text-xs text-ink-soft">
                        <span className="w-6 text-right font-semibold">{stars}★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                            <span
                                className="block h-full rounded-full bg-warning-500"
                                style={{ width: count ? `${(total / count) * 100}%` : "0%" }}
                            />
                        </span>
                        <span className="w-5 tabular-nums">{total}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
