import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Rating";
import type { Review } from "@/interfaces/review.interface";
import { formatRelative } from "@/lib/format";

/** Una reseña. Reutilizable en el perfil del tutor y en el panel del tutor. */
export function ReviewItem({ review }: { review: Review }) {
    return (
        <article className="rounded-xl border border-line bg-surface p-4">
            <header className="mb-2 flex items-center gap-3">
                <Avatar name={review.student.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{review.student.fullName}</p>
                    <p className="text-xs text-ink-muted">{formatRelative(review.createdAt)}</p>
                </div>
                <Stars value={review.rating} />
            </header>
            <p className="text-sm text-ink-soft">“{review.comment}”</p>
        </article>
    );
}
