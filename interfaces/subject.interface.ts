import type { PageParams } from "./pagination.interface";

export interface Subject {
    id: string;
    name: string;
    university: string;
    semester: string;
}

export interface CreateSubjectInput {
    name: string;
    university: string;
    semester: string;
}

export type SubjectFilters = PageParams & {
    university?: string;
    semester?: string;
    search?: string;
};
