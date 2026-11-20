/**
 * Fuente única de verdad de las rutas. Si una ruta cambia, se cambia aquí
 * y no en 30 `href` regados por el código.
 */
export const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    sessionExpired: "/session-expired",

    // Estudiante
    studentHome: "/inicio",
    tutors: "/tutores",
    tutor: (id: string) => `/tutores/${id}`,
    book: (tutorId: string) => `/reservar/${tutorId}`,
    bookings: "/mis-tutorias",
    newReview: (bookingId: string) => `/resenas/nueva?booking=${bookingId}`,

    // Tutor
    tutorPanel: "/panel",
    tutorProfile: "/panel/perfil",
    tutorReviews: "/panel/resenas",

    // Admin
    adminUsers: "/admin/usuarios",
    adminSubjects: "/admin/materias",
    adminTutors: "/admin/tutores",

    // Todos
    profile: "/perfil"
} as const;

/** Prefijos que exigen sesión. Los usa `proxy.ts`. */
export const PROTECTED_PREFIXES = [
    "/inicio",
    "/tutores",
    "/reservar",
    "/mis-tutorias",
    "/resenas",
    "/panel",
    "/admin",
    "/perfil"
] as const;

/** Rutas solo para visitantes (si ya hay sesión se redirige). */
export const AUTH_ROUTES = ["/login", "/register"] as const;
