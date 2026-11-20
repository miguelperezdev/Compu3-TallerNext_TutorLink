import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole, type SessionUser } from "@/interfaces/user.interface";
import { homeForRoles, hasRole } from "./roles";
import { ROUTES } from "./routes";

export const TOKEN_COOKIE = "token";
export const USER_COOKIE = "user";
// Igual que JWT_EXPIRES_IN del backend (1h por defecto).
const ONE_HOUR = 60 * 60;

export type Session = { token: string; user: SessionUser };

const cookieOptions = () => ({
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_HOUR
});

export async function createSession(token: string, user: SessionUser) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE, token, cookieOptions());
    cookieStore.set(USER_COOKIE, JSON.stringify(user), cookieOptions());
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE);
    cookieStore.delete(USER_COOKIE);
}

export async function getToken() {
    return (await cookies()).get(TOKEN_COOKIE)?.value;
}

const VALID_ROLES = Object.values(UserRole) as string[];

/** Lee y valida la cookie `user`. Devuelve null si falta o está corrupta. */
export async function getCurrentUser(): Promise<SessionUser | null> {
    const value = (await cookies()).get(USER_COOKIE)?.value;
    if (!value) return null;

    try {
        const u = JSON.parse(value) as Partial<SessionUser>;
        if (
            typeof u.id === "string" &&
            typeof u.fullName === "string" &&
            typeof u.email === "string" &&
            Array.isArray(u.roles)
        ) {
            return {
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                roles: u.roles.filter((r): r is UserRole => VALID_ROLES.includes(r))
            };
        }
    } catch {
        return null;
    }
    return null;
}

/**
 * Devuelve token + usuario o manda al login guardando la ruta de origen.
 * Se usa en páginas y Server Actions: el proxy NO es la única barrera
 * (las Server Actions se saltan el proxy, ver proxy.ts).
 */
export async function requireSession(from: string): Promise<Session> {
    const [token, user] = await Promise.all([getToken(), getCurrentUser()]);

    if (!token || !user) {
        // Cookies a medias (p. ej. cookie `user` vieja): se limpian en el route handler.
        redirect(`${ROUTES.sessionExpired}?from=${encodeURIComponent(from)}`);
    }

    return { token, user };
}

/**
 * Como `requireSession`, pero además exige alguno de los roles.
 * Si el usuario no tiene permiso lo manda a SU pantalla de inicio
 * (así nunca hay bucles de redirección).
 */
export async function requireRole(roles: UserRole[], from: string): Promise<Session> {
    const session = await requireSession(from);

    if (!hasRole(session.user.roles, roles)) {
        redirect(homeForRoles(session.user.roles));
    }

    return session;
}
