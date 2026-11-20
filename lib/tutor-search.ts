import type { TutorFilters, TutorProfile } from "@/interfaces/tutor.interface";
import { readParam, readPositiveInt } from "./pagination";

export const TUTORS_PAGE_SIZE = 6;
export type TutorSort = "price-asc" | "price-desc" | "name";

export const TUTOR_SORT_OPTIONS: { value: TutorSort; label: string }[] = [
    { value: "price-asc", label: "Menor precio" },
    { value: "price-desc", label: "Mayor precio" },
    { value: "name", label: "Nombre (A-Z)" }
];

export type TutorSearchParams = {
    q: string;
    subjectId: string;
    university: string;
    maxRate: number | undefined;
    verified: boolean;
    sort: TutorSort;
    page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

/** Convierte la query de /tutores en un objeto tipado y seguro. */
export function parseTutorSearchParams(raw: RawParams): TutorSearchParams {
    const maxRate = readPositiveInt(raw.maxRate, 0);
    const sort = readParam(raw.sort);

    return {
        q: readParam(raw.q),
        subjectId: readParam(raw.subjectId),
        university: readParam(raw.university),
        maxRate: maxRate || undefined,
        verified: readParam(raw.verified) === "true",
        sort: TUTOR_SORT_OPTIONS.some((o) => o.value === sort) ? (sort as TutorSort) : "price-asc",
        page: readPositiveInt(raw.page, 1)
    };
}

/** Parte de los filtros que entiende la API (el resto se resuelve en memoria). */
export function toApiFilters(p: TutorSearchParams): TutorFilters {
    return {
        subjectId: p.subjectId || undefined,
        university: p.university || undefined,
        maxRate: p.maxRate,
        verified: p.verified || undefined,
        limit: 200
    };
}

const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Búsqueda por texto en nombre, universidad y materias (sin tildes ni mayúsculas). */
export function filterTutorsByText(tutors: TutorProfile[], term: string) {
    const t = normalize(term);
    if (!t) return tutors;

    return tutors.filter((tutor) =>
        [tutor.user.fullName, tutor.university, ...tutor.subjects.map((s) => s.name)].some((field) =>
            normalize(field).includes(t)
        )
    );
}

export function sortTutors(tutors: TutorProfile[], sort: TutorSort) {
    const list = [...tutors];
    if (sort === "price-desc") return list.sort((a, b) => b.hourlyRate - a.hourlyRate);
    if (sort === "name") return list.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName, "es"));
    return list.sort((a, b) => a.hourlyRate - b.hourlyRate);
}

/** Arma una query string omitiendo vacíos (para Paginator / links). */
export function toQuery(params: Record<string, string | number | boolean | undefined>) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "" && v !== false) query.set(k, String(v));
    }
    return query.toString();
}
