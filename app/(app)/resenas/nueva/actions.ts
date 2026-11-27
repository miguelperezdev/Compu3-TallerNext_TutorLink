"use server";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api";
import { parseRating, validateReview, type ReviewErrors } from "@/lib/review-utils";
import { createReview } from "@/lib/review-api";
import { ROUTES } from "@/lib/routes";
import { requireRole } from "@/lib/session";
import { UserRole } from "@/interfaces/user.interface";

export type ReviewFormState = {
    /** Error general (409, 403, 400, red...). */
    error?: string;
    /** Errores por campo. */
    errors?: ReviewErrors;
    /** Valores a rehidratar al fallar. */
    rating?: number;
    comment?: string;
    /** Reseña creada (pantalla de gracias). */
    done?: boolean;
};

export async function createReviewAction(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
    const bookingId = String(formData.get("bookingId") ?? "");
    const rating = parseRating(String(formData.get("rating") ?? ""));
    const comment = String(formData.get("comment") ?? "").trim();

    // Las Server Actions se saltan el proxy: se revalida sesión y rol aquí.
    const session = await requireRole([UserRole.STUDENT], ROUTES.newReview(bookingId));

    const errors = validateReview(rating, comment);
    if (Object.keys(errors).length > 0) return { errors, rating, comment };
    if (!bookingId) return { error: "No se indicó la tutoría a calificar.", rating, comment };

    try {
        const review = await createReview(session.token, { bookingId, rating, comment });
        // La lista de reseñas y el promedio del tutor están cacheados con este tag.
        updateTag(`reviews-${review.tutorProfile.id}`);
        return { done: true };
    } catch (error) {
        if (isApiError(error)) {
            if (error.status === 401) {
                redirect(`${ROUTES.sessionExpired}?from=${encodeURIComponent(ROUTES.newReview(bookingId))}`);
            }
            if (error.status === 409) return { error: "Ya calificaste esta sesión.", rating, comment };
            if (error.status === 403) return { error: "Solo puedes calificar tutorías en las que fuiste el estudiante.", rating, comment };
            if (error.status === 404) return { error: "No encontramos la reserva a calificar.", rating, comment };
            if (error.status === 400) return { error: `No se pudo enviar la reseña: ${error.message}`, rating, comment };
        }
        return { error: "No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.", rating, comment };
    }
}
