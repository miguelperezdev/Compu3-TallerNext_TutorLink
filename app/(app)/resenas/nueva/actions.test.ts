import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateTag } from "next/cache";
import { ApiError } from "@/lib/api";
import { createReview } from "@/lib/review-api";
import { requireRole } from "@/lib/session";
import type { Review } from "@/interfaces/review.interface";
import { makeTutorProfile, makeUser } from "@/test/fixtures";
import { createReviewAction } from "./actions";

vi.mock("next/navigation", () => ({
    redirect: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
    })
}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/lib/session", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/review-api", () => ({ createReview: vi.fn() }));

const review: Review = {
    id: "review-1",
    rating: 5,
    comment: "Excelente tutor",
    student: makeUser(),
    tutorProfile: makeTutorProfile({ id: "tutor-profile-9" }),
    createdAt: "2026-12-10T20:00:00.000Z"
};

function formData(overrides: Record<string, string> = {}) {
    const data = new FormData();
    const fields = { bookingId: "booking-1", rating: "5", comment: "Excelente tutor", ...overrides };
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
}

describe("createReviewAction", () => {
    beforeEach(() => {
        vi.mocked(requireRole).mockResolvedValue({ token: "jwt", user: makeUser() });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("exige rol estudiante", async () => {
        vi.mocked(createReview).mockResolvedValue(review);
        await createReviewAction({}, formData());
        expect(requireRole).toHaveBeenCalledWith(["student"], "/resenas/nueva?booking=booking-1");
    });

    it("crea la reseña, invalida el caché del tutor y marca como hecha", async () => {
        vi.mocked(createReview).mockResolvedValue(review);

        const state = await createReviewAction({}, formData());

        expect(createReview).toHaveBeenCalledWith("jwt", { bookingId: "booking-1", rating: 5, comment: "Excelente tutor" });
        expect(updateTag).toHaveBeenCalledWith("reviews-tutor-profile-9");
        expect(state).toEqual({ done: true });
    });

    it("recorta espacios del comentario antes de enviarlo", async () => {
        vi.mocked(createReview).mockResolvedValue(review);
        await createReviewAction({}, formData({ comment: "   Muy buena   " }));
        expect(createReview).toHaveBeenCalledWith("jwt", expect.objectContaining({ comment: "Muy buena" }));
    });

    it("valida calificación y comentario sin llamar a la API", async () => {
        const state = await createReviewAction({}, formData({ rating: "", comment: "ab" }));
        expect(state.errors?.rating).toBeDefined();
        expect(state.errors?.comment).toBeDefined();
        expect(state.comment).toBe("ab");
        expect(createReview).not.toHaveBeenCalled();
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("rechaza calificaciones manipuladas (fuera de 1 a 5)", async () => {
        for (const rating of ["0", "6", "99", "-3", "abc"]) {
            const state = await createReviewAction({}, formData({ rating }));
            expect(state.errors?.rating).toBeDefined();
        }
        expect(createReview).not.toHaveBeenCalled();
    });

    it("rechaza si no viene el id de la reserva", async () => {
        const state = await createReviewAction({}, formData({ bookingId: "" }));
        expect(state.error).toBeDefined();
        expect(createReview).not.toHaveBeenCalled();
    });

    it("409: ya calificó esta sesión (sin invalidar caché)", async () => {
        vi.mocked(createReview).mockRejectedValue(new ApiError(409, "already reviewed"));
        const state = await createReviewAction({}, formData());
        expect(state.error).toMatch(/ya calificaste/i);
        expect(state.rating).toBe(5);
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("403, 404 y 400 tienen mensajes claros", async () => {
        vi.mocked(createReview).mockRejectedValueOnce(new ApiError(403, "forbidden"));
        expect((await createReviewAction({}, formData())).error).toMatch(/fuiste el estudiante/i);

        vi.mocked(createReview).mockRejectedValueOnce(new ApiError(404, "nf"));
        expect((await createReviewAction({}, formData())).error).toMatch(/no encontramos/i);

        vi.mocked(createReview).mockRejectedValueOnce(new ApiError(400, "Only COMPLETED bookings can be reviewed"));
        expect((await createReviewAction({}, formData())).error).toContain("Only COMPLETED");
    });

    it("401: redirige a sesión vencida", async () => {
        vi.mocked(createReview).mockRejectedValue(new ApiError(401, "jwt expired"));
        await expect(createReviewAction({}, formData())).rejects.toThrow("REDIRECT:/session-expired");
    });

    it("error de red: mensaje genérico", async () => {
        vi.mocked(createReview).mockRejectedValue(new Error("ECONNREFUSED"));
        expect((await createReviewAction({}, formData())).error).toMatch(/no pudimos conectar/i);
    });
});
