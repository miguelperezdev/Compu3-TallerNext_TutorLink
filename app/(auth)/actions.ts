"use server";
import { redirect } from "next/navigation";
import { ApiError, isApiError } from "@/lib/api";
import { login, logout, register } from "@/lib/auth-api";
import { homeForRoles } from "@/lib/roles";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { ROUTES } from "@/lib/routes";
import { createSession, deleteSession, getToken } from "@/lib/session";
import type { AuthResponse } from "@/interfaces/user.interface";

export type AuthFormState = {
    error?: string;
    /** Errores por campo (registro). */
    errors?: Partial<Record<"email" | "password" | "confirmPassword" | "fullName", string>>;
    /** Valores a rehidratar (nunca la contraseña). */
    email?: string;
    fullName?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mismos límites que los DTO Login/Register del backend.
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 16;

function startSession(auth: AuthResponse) {
    return createSession(auth.token, {
        id: auth.id,
        email: auth.email,
        fullName: auth.fullName,
        roles: auth.roles
    });
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!EMAIL_PATTERN.test(email) || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
        return {
            error: `Correo o contraseña inválidos. La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`,
            email
        };
    }

    let auth: AuthResponse;
    try {
        auth = await login(email, password);
        await startSession(auth);
    } catch (error) {
        if (isApiError(error) && (error.status === 401 || error.status === 400)) {
            return { error: "Correo o contraseña incorrectos.", email };
        }
        return { error: "No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.", email };
    }

    // `from` solo se respeta si es una ruta interna; si no, a la home del rol.
    redirect(safeRedirectPath(formData.get("from"), homeForRoles(auth.roles)));
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const errors: AuthFormState["errors"] = {};
    if (fullName.length < 3) errors.fullName = "Escribe tu nombre completo (mínimo 3 caracteres).";
    if (!EMAIL_PATTERN.test(email)) errors.email = "El correo no tiene un formato válido.";
    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
        errors.password = `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`;
    }
    if (confirmPassword !== password) errors.confirmPassword = "Las contraseñas no coinciden.";

    if (Object.keys(errors).length > 0) return { errors, email, fullName };

    let auth: AuthResponse;
    try {
        auth = await register(email, password, fullName);
        await startSession(auth);
    } catch (error) {
        if (error instanceof ApiError || isApiError(error)) {
            if (error.status === 409) {
                return { errors: { email: "Ya existe una cuenta con este correo." }, email, fullName };
            }
            return { error: `No se pudo crear la cuenta: ${error.message}`, email, fullName };
        }
        return { error: "No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.", email, fullName };
    }

    redirect(homeForRoles(auth.roles));
}

export async function logoutAction() {
    const token = await getToken();
    if (token) {
        // Revoca el JWT en el backend. Si falla (token ya vencido, API caída),
        // igual cerramos la sesión local.
        await logout(token).catch(() => undefined);
    }
    await deleteSession();
    redirect(ROUTES.login);
}
