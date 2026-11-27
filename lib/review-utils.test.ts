import { describe, expect, it } from "vitest";
import { parseRating, REVIEW_COMMENT_MAX, REVIEW_COMMENT_MIN, validateReview } from "./review-utils";

describe("parseRating", () => {
    it("acepta enteros de 1 a 5", () => {
        expect([1, 2, 3, 4, 5].map((n) => parseRating(String(n)))).toEqual([1, 2, 3, 4, 5]);
    });

    it("devuelve 0 si está fuera de rango, no es entero o no es número", () => {
        for (const value of ["0", "6", "-1", "3.5", "abc", "", " "]) {
            expect(parseRating(value)).toBe(0);
        }
    });
});

describe("validateReview", () => {
    it("acepta una reseña válida", () => {
        expect(validateReview(5, "Muy buena tutoría")).toEqual({});
    });

    it("exige calificación entre 1 y 5", () => {
        expect(validateReview(0, "Muy buena tutoría").rating).toBeDefined();
        expect(validateReview(6, "Muy buena tutoría").rating).toBeDefined();
    });

    it("acepta exactamente el mínimo y el máximo de caracteres", () => {
        expect(validateReview(4, "a".repeat(REVIEW_COMMENT_MIN)).comment).toBeUndefined();
        expect(validateReview(4, "a".repeat(REVIEW_COMMENT_MAX)).comment).toBeUndefined();
    });

    it("rechaza comentarios demasiado cortos o largos", () => {
        expect(validateReview(4, "ab").comment).toMatch(/al menos/i);
        expect(validateReview(4, "a".repeat(REVIEW_COMMENT_MAX + 1)).comment).toMatch(/no puede superar/i);
    });

    it("ignora los espacios al contar (un comentario de espacios es inválido)", () => {
        expect(validateReview(4, "     ").comment).toBeDefined();
        expect(validateReview(4, "  ab  ").comment).toBeDefined();
    });

    it("reporta ambos errores a la vez", () => {
        expect(Object.keys(validateReview(0, "")).sort()).toEqual(["comment", "rating"]);
    });
});
