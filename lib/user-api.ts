import "server-only";
import { api, withAuth } from "./api";
import type { PageParams } from "@/interfaces/pagination.interface";
import type { User, UserRole } from "@/interfaces/user.interface";

// Solo admin.

export async function getUsers(token: string, params: PageParams = {}) {
    const { data } = await api.get<User[]>("/user", { ...withAuth(token), params });
    return data;
}

export async function getUser(token: string, id: string) {
    const { data } = await api.get<User>(`/user/${id}`, withAuth(token));
    return data;
}

export async function updateUserRoles(token: string, id: string, roles: UserRole[]) {
    const { data } = await api.patch<User>(`/user/${id}/roles`, { roles }, withAuth(token));
    return data;
}

export async function deactivateUser(token: string, id: string) {
    const { data } = await api.delete<{ message: string }>(`/user/${id}`, withAuth(token));
    return data;
}
