import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api, toResult, unwrap, withAuth } from "./api";
import type { CreateSubjectInput, Subject, SubjectFilters } from "@/interfaces/subject.interface";

/** El catálogo cambia poco: se cachea horas. Invalidar con updateTag("subjects"). */
async function fetchSubjects(token: string, filters: SubjectFilters) {
    "use cache";
    cacheLife("hours");
    cacheTag("subjects");
    return toResult(async () => {
        const { data } = await api.get<Subject[]>("/subject", { ...withAuth(token), params: filters });
        return data;
    });
}

export async function getSubjects(token: string, filters: SubjectFilters = {}) {
    return unwrap(await fetchSubjects(token, filters));
}

async function fetchSubject(token: string, id: string) {
    "use cache";
    cacheLife("hours");
    cacheTag("subjects", `subject-${id}`);
    return toResult(async () => {
        const { data } = await api.get<Subject>(`/subject/${encodeURIComponent(id)}`, withAuth(token));
        return data;
    });
}

export async function getSubject(token: string, id: string) {
    return unwrap(await fetchSubject(token, id));
}

// --- Admin (sin caché; el que llama debe hacer updateTag("subjects")) ---

export async function createSubject(token: string, input: CreateSubjectInput) {
    const { data } = await api.post<Subject>("/subject", input, withAuth(token));
    return data;
}

export async function updateSubject(token: string, id: string, input: Partial<CreateSubjectInput>) {
    const { data } = await api.patch<Subject>(`/subject/${id}`, input, withAuth(token));
    return data;
}

export async function deleteSubject(token: string, id: string) {
    const { data } = await api.delete<Subject>(`/subject/${id}`, withAuth(token));
    return data;
}
