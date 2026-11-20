import { RatingSummary } from "@/components/ui/Rating";
import { getTutorReviews } from "@/lib/review-api";
import { getToken } from "@/lib/session";

/**
 * Promedio y cantidad de reseñas de un tutor.
 * El backend no incluye el rating en GET /tutor, así que se pide por tarjeta
 * (cacheado por tutor). Va dentro de su propio <Suspense> para no frenar la lista.
 * Es decorativo: si falla, no rompe la tarjeta.
 */
export async function TutorRating({ tutorId }: { tutorId: string }) {
    const token = await getToken();
    if (!token) return null;

    let summary: { average: number; count: number };
    try {
        const { average, count } = await getTutorReviews(token, tutorId);
        summary = { average, count };
    } catch {
        return null;
    }

    return <RatingSummary average={summary.average} count={summary.count} />;
}
