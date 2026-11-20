import type { PageParams } from "./pagination.interface";
import type { Subject } from "./subject.interface";
import type { TutorProfile } from "./tutor.interface";
import type { User } from "./user.interface";

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}

export interface Booking {
    id: string;
    student: User;
    tutorProfile: TutorProfile;
    subject: Subject;
    /** ISO 8601 (timestamptz). */
    startAt: string;
    endAt: string;
    status: BookingStatus;
}

export interface CreateBookingInput {
    tutorProfileId: string;
    subjectId: string;
    startAt: string;
    endAt: string;
}

export type BookingFilters = PageParams & { status?: BookingStatus };
