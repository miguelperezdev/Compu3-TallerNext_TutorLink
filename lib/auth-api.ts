import "server-only";
import { api, withAuth } from "./api";
import type { AuthResponse, User } from "@/interfaces/user.interface";

export async function login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/user/auth", { email, password });
    return data;
}

export async function register(email: string, password: string, fullName: string) {
    const { data } = await api.post<AuthResponse>("/user/signup", { email, password, fullName });
    return data;
}

/** Invalida el JWT en el backend (tokenVersion++). */
export async function logout(token: string) {
    await api.post("/user/logout", undefined, withAuth(token));
}

export async function getMe(token: string) {
    const { data } = await api.get<User>("/user/me", withAuth(token));
    return data;
}
