import type { PageParams } from "./pagination.interface";
import type { Subject } from "./subject.interface";
import type { User } from "./user.interface";

export interface TutorProfile {
    id: string;
    bio: string;
    academicHistory: string;
    /** COP por hora. */
    hourlyRate: number;
    university: string;
    isVerified: boolean;
    user: User;
    subjects: Subject[];
}

/** Query de GET /tutor. Todos opcionales. */
export type TutorFilters = PageParams & {
    subjectId?: string;
    university?: string;
    maxRate?: number;
    verified?: boolean;
};

/** Body de PUT /tutor/me. */
export interface UpsertTutorProfileInput {
    bio: string;
    academicHistory: string;
    hourlyRate: number;
    university: string;
    subjectIds: string[];
}
