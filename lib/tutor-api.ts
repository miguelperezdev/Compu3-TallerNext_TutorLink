import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api, toResult, unwrap, withAuth } from "./api";
import type { TutorFilters, TutorProfile, UpsertTutorProfileInput } from "@/interfaces/tutor.interface";

/**
 * Marketplace. El backend ordena por tarifa ascendente.
 * Tag `tutors`: invalidar al verificar un tutor o al editar un perfil.
 * (Patrón fetchX cacheada + getX pública: ver `toResult` en lib/api.ts.)
 */
async function fetchTutors(token: string, filters: TutorFilters) {
    "use cache";
    cacheLife("minutes");
    cacheTag("tutors");
    return toResult(async () => {
        const { data } = await api.get<TutorProfile[]>("/tutor", { ...withAuth(token), params: filters });
        return data;
    });
}

export async function getTutors(token: string, filters: TutorFilters = {}) {
    return unwrap(await fetchTutors(token, filters));
}

async function fetchTutor(token: string, id: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag("tutors", `tutor-${id}`);
    return toResult(async () => {
        const { data } = await api.get<TutorProfile>(`/tutor/${encodeURIComponent(id)}`, withAuth(token));
        return data;
    });
}

export async function getTutor(token: string, id: string) {
    return unwrap(await fetchTutor(token, id));
}

/** PUT /tutor/me (rol tutor): crea o reemplaza TODO el perfil. */
export async function upsertMyTutorProfile(token: string, input: UpsertTutorProfileInput) {
    const { data } = await api.put<TutorProfile>("/tutor/me", input, withAuth(token));
    return data;
}

/** PATCH /tutor/:id/verify (admin). */
export async function verifyTutor(token: string, id: string) {
    const { data } = await api.patch<TutorProfile>(`/tutor/${id}/verify`, undefined, withAuth(token));
    return data;
}
