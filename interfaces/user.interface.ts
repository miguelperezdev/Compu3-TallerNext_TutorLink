export enum UserRole {
    STUDENT = "student",
    TUTOR = "tutor",
    ADMIN = "admin"
}

/** Usuario tal como lo devuelve la API (GET /user/me, relaciones eager). */
export interface User {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    roles: UserRole[];
}

/** Respuesta de POST /user/signup y POST /user/auth. */
export interface AuthResponse extends User {
    token: string;
}

/** Lo que guardamos en la cookie `user` (sin el token). */
export interface SessionUser {
    id: string;
    fullName: string;
    email: string;
    roles: UserRole[];
}
