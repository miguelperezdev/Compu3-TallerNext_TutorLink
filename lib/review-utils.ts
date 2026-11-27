// Mismos límites que CreateReviewDto del backend.
export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_COMMENT_MIN = 3;
export const REVIEW_COMMENT_MAX = 500;

export type ReviewErrors = Partial<Record<"rating" | "comment", string>>;

/** Convierte el valor del formulario en calificación; 0 si no es un entero válido. */
export function parseRating(value: string) {
    const n = Number(value);
    return Number.isInteger(n) && n >= REVIEW_RATING_MIN && n <= REVIEW_RATING_MAX ? n : 0;
}

/** Validación compartida por el formulario (cliente) y la Server Action. */
export function validateReview(rating: number, comment: string): ReviewErrors {
    const errors: ReviewErrors = {};
    const text = comment.trim();

    if (rating < REVIEW_RATING_MIN || rating > REVIEW_RATING_MAX) {
        errors.rating = "Elige una calificación de 1 a 5 estrellas.";
    }
    if (text.length < REVIEW_COMMENT_MIN) {
        errors.comment = `Escribe un comentario de al menos ${REVIEW_COMMENT_MIN} caracteres.`;
    } else if (text.length > REVIEW_COMMENT_MAX) {
        errors.comment = `El comentario no puede superar ${REVIEW_COMMENT_MAX} caracteres.`;
    }
    return errors;
}
