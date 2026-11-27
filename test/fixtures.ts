import { BookingStatus, type Booking } from "@/interfaces/booking.interface";
import type { Subject } from "@/interfaces/subject.interface";
import type { TutorProfile } from "@/interfaces/tutor.interface";
import { UserRole, type User } from "@/interfaces/user.interface";

export const STUDENT_ID = "student-1";
export const TUTOR_USER_ID = "tutor-user-1";

export function makeUser(overrides: Partial<User> = {}): User {
    return {
        id: STUDENT_ID,
        email: "ana@example.com",
        fullName: "Ana Estudiante",
        isActive: true,
        roles: [UserRole.STUDENT],
        ...overrides
    };
}

export function makeSubject(overrides: Partial<Subject> = {}): Subject {
    return {
        id: "subject-1",
        name: "Cálculo I",
        university: "Icesi",
        semester: "1",
        ...overrides
    };
}

export function makeTutorProfile(overrides: Partial<TutorProfile> = {}): TutorProfile {
    return {
        id: "tutor-profile-1",
        bio: "Tutor con experiencia",
        academicHistory: "Ingeniería",
        hourlyRate: 15000,
        university: "Icesi",
        isVerified: true,
        user: makeUser({ id: TUTOR_USER_ID, fullName: "Carlos Tutor", email: "tutor1@example.com", roles: [UserRole.TUTOR] }),
        subjects: [makeSubject()],
        ...overrides
    };
}

export function makeBooking(overrides: Partial<Booking> = {}): Booking {
    return {
        id: "booking-1",
        student: makeUser(),
        tutorProfile: makeTutorProfile(),
        subject: makeSubject(),
        startAt: "2026-12-09T15:00:00.000Z",
        endAt: "2026-12-09T17:00:00.000Z",
        status: BookingStatus.PENDING,
        ...overrides
    };
}
