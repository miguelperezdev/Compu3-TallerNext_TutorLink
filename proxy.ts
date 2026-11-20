import { NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, PROTECTED_PREFIXES, ROUTES } from "@/lib/routes";

function matchesRoute(pathname: string, route: string) {
    return pathname === route || pathname.startsWith(route + "/");
}

/**
 * Primera barrera: solo mira si existe la cookie `token`.
 * NO valida el JWT ni los roles (eso lo hacen `requireSession` / `requireRole` en cada
 * página y Server Action, y en último término el backend con 401/403).
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Las Server Actions llegan como POST a la ruta de la página. Si se redirigen
    // aquí, el cliente recibe HTML en vez de RSC ("An unexpected response...").
    // Por eso cada acción vuelve a revisar la sesión por su cuenta.
    if (request.headers.has("next-action")) {
        return NextResponse.next();
    }

    const hasToken = request.cookies.has("token");

    if (!hasToken && PROTECTED_PREFIXES.some((route) => matchesRoute(pathname, route))) {
        const loginUrl = new URL(ROUTES.login, request.url);
        loginUrl.searchParams.set("from", pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    if (hasToken && (AUTH_ROUTES as readonly string[]).includes(pathname)) {
        // /inicio redirige a la pantalla correcta según el rol.
        return NextResponse.redirect(new URL(ROUTES.studentHome, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // /session-expired queda fuera a propósito: debe poder borrar cookies sin interferencia.
    matcher: [
        "/inicio/:path*",
        "/tutores/:path*",
        "/reservar/:path*",
        "/mis-tutorias/:path*",
        "/resenas/:path*",
        "/panel/:path*",
        "/admin/:path*",
        "/perfil/:path*",
        "/login",
        "/register"
    ]
};
