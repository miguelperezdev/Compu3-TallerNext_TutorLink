import type { TutorProfile } from "./tutor.interface";
import type { User } from "./user.interface";

export interface Review {
    id: string;
    /** 1 a 5. */
    rating: number;
    comment: string;
    student: User;
    tutorProfile: TutorProfile;
    createdAt: string;
}

/** Respuesta de GET /review/tutor/:tutorId. */
export interface TutorReviews {
    average: number;
    count: number;
    reviews: Review[];
}

export interface CreateReviewInput {
    bookingId: string;
    rating: number;
    comment: string;
}
