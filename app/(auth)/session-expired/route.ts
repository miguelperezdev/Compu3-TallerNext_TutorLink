import { NextRequest, NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { ROUTES } from "@/lib/routes";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

/**
 * Los Server Components NO pueden borrar cookies. Cuando la API responde 401
 * (JWT vencido o revocado) se redirige aquí: este Route Handler sí puede, limpia
 * la sesión y manda al login conservando la ruta de origen.
 * (Sin esto, el proxy vería la cookie `token` y devolvería al usuario a /inicio: bucle.)
 */
export function GET(request: NextRequest) {
    const from = safeRedirectPath(request.nextUrl.searchParams.get("from"));
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("from", from);
    loginUrl.searchParams.set("expired", "1");

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(TOKEN_COOKIE);
    response.cookies.delete(USER_COOKIE);
    return response;
}
