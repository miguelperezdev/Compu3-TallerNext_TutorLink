import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "@/components/form-ui/Input";
import { Select } from "@/components/form-ui/Select";
import { Button } from "@/components/ui/Button";
import type { Subject } from "@/interfaces/subject.interface";
import { ROUTES } from "@/lib/routes";
import { TUTOR_SORT_OPTIONS, type TutorSearchParams } from "@/lib/tutor-search";

/**
 * Filtros del marketplace. Es un <form method="GET">: al enviar, el navegador arma
 * la URL (/tutores?q=...&subjectId=...) y el Server Component de la página la lee.
 * Sin useState ni JavaScript: el estado vive en la URL (se puede compartir el link).
 */
export function TutorFilters({ subjects, values }: { subjects: Subject[]; values: TutorSearchParams }) {
    const universities = [...new Set(subjects.map((s) => s.university))].sort((a, b) => a.localeCompare(b, "es"));

    return (
        <form
            action={ROUTES.tutors}
            method="get"
            className="mb-6 grid gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
        >
            <div className="sm:col-span-2 lg:col-span-4">
                <div className="relative">
                    <IoSearchOutline
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lg text-ink-muted"
                    />
                    <input
                        type="search"
                        name="q"
                        defaultValue={values.q}
                        aria-label="Buscar por materia, tutor o universidad"
                        placeholder="Buscar materia, tutor o universidad..."
                        className="w-full rounded-xl border border-line bg-canvas py-3 pr-4 pl-10 text-sm placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                    />
                </div>
            </div>

            <Select
                label="Materia"
                name="subjectId"
                placeholder="Todas"
                defaultValue={values.subjectId}
                options={subjects.map((s) => ({
                    value: s.id,
                    label: `${s.name} · ${s.university}`
                }))}
            />
            <Select
                label="Universidad"
                name="university"
                placeholder="Todas"
                defaultValue={values.university}
                options={universities.map((u) => ({ value: u, label: u }))}
            />
            <Input
                label="Tarifa máxima (COP/h)"
                name="maxRate"
                type="number"
                min={1000}
                step={1000}
                inputMode="numeric"
                placeholder="Ej. 25000"
                defaultValue={values.maxRate}
            />
            <Select label="Ordenar por" name="sort" defaultValue={values.sort} options={TUTOR_SORT_OPTIONS} />

            <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2 lg:col-span-2">
                <input
                    type="checkbox"
                    name="verified"
                    value="true"
                    defaultChecked={values.verified}
                    className="size-4 rounded border-line accent-brand-600"
                />
                Solo tutores verificados
            </label>

            <div className="flex items-center justify-end gap-2 sm:col-span-2 lg:col-span-2">
                <Link href={ROUTES.tutors} className="px-3 text-sm font-semibold text-ink-soft hover:text-ink">
                    Limpiar
                </Link>
                <Button type="submit">Aplicar filtros</Button>
            </div>
        </form>
    );
}
