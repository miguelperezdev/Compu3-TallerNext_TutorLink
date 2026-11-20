import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api, toResult, unwrap, withAuth } from "./api";
import type { CreateReviewInput, Review, TutorReviews } from "@/interfaces/review.interface";

/** Reseñas + promedio de un tutor. Tag `reviews-<tutorId>`: invalidar al crear una reseña. */
async function fetchTutorReviews(token: string, tutorProfileId: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag("reviews", `reviews-${tutorProfileId}`);
    return toResult(async () => {
        const { data } = await api.get<TutorReviews>(
            `/review/tutor/${encodeURIComponent(tutorProfileId)}`,
            withAuth(token)
        );
        return data;
    });
}

export async function getTutorReviews(token: string, tutorProfileId: string) {
    return unwrap(await fetchTutorReviews(token, tutorProfileId));
}

/** POST /review (estudiante dueño de una reserva COMPLETED). */
export async function createReview(token: string, input: CreateReviewInput) {
    const { data } = await api.post<Review>("/review", input, withAuth(token));
    return data;
}
