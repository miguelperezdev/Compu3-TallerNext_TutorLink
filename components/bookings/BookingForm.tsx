"use client";
import { useActionState, useState, type FormEvent, type ReactNode } from "react";
import { createBookingAction, type BookingFormState } from "@/app/(app)/reservar/[tutorId]/actions";
import { Input } from "@/components/form-ui/Input";
import { Select } from "@/components/form-ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Subject } from "@/interfaces/subject.interface";
import {
    BOOKING_HOURS,
    bookingHours,
    bookingTotal,
    validateSchedule,
    type ScheduleErrors,
    type ScheduleInput
} from "@/lib/booking-utils";
import { formatCOP, formatDateTime, formatTimeRange } from "@/lib/format";

type Props = {
    tutor: { id: string; fullName: string; hourlyRate: number; subjects: Subject[] };
    /** Cabecera del tutor (Server Component). */
    children?: ReactNode;
};

type Step = "schedule" | "summary";

const initialState: BookingFormState = {};
const START_HOURS = BOOKING_HOURS.slice(0, -1);

export function BookingForm({ tutor, children }: Props) {
    const [state, formAction] = useActionState(createBookingAction, initialState);
    const [step, setStep] = useState<Step>("schedule");
    const [values, setValues] = useState<ScheduleInput>({
        subjectId: tutor.subjects.length === 1 ? tutor.subjects[0].id : "",
        date: "",
        startTime: "",
        endTime: ""
    });
    const [errors, setErrors] = useState<ScheduleErrors>({});
    const [range, setRange] = useState<{ startAt: string; endAt: string } | null>(null);

    function update(field: keyof ScheduleInput, value: string) {
        setValues((prev) => {
            const next = { ...prev, [field]: value };
            // Si el nuevo inicio deja la hora de fin inválida, se limpia.
            if (field === "startTime" && next.endTime && next.endTime <= value) next.endTime = "";
            return next;
        });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function handleContinue(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = validateSchedule(
            values,
            tutor.subjects.map((s) => s.id)
        );
        if (!result.startAt || !result.endAt) {
            setErrors(result.errors);
            return;
        }
        setErrors({});
        setRange({ startAt: result.startAt, endAt: result.endAt });
        setStep("summary");
    }

    const subject = tutor.subjects.find((s) => s.id === values.subjectId);
    const serverFieldErrors = Object.values(state.errors ?? {}).filter(Boolean);

    if (step === "summary" && range && subject) {
        return (
            <>
                <PageHeader eyebrow="Paso 3 de 3 · Resumen" title="Resumen de tu reserva" />
                {children}

                <form action={formAction} className="mt-6 space-y-4">
                    <input type="hidden" name="tutorProfileId" value={tutor.id} />
                    <input type="hidden" name="subjectId" value={values.subjectId} />
                    <input type="hidden" name="date" value={values.date} />
                    <input type="hidden" name="startTime" value={values.startTime} />
                    <input type="hidden" name="endTime" value={values.endTime} />

                    {state.error && <Alert tone="danger">{state.error}</Alert>}
                    {serverFieldErrors.length > 0 && (
                        <Alert tone="danger">Revisa el horario: {serverFieldErrors.join(" ")}</Alert>
                    )}

                    <Card className="space-y-3">
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <SummaryRow label="Tutor" value={tutor.fullName} />
                            <SummaryRow label="Materia" value={`${subject.name} · ${subject.university}`} />
                            <SummaryRow label="Fecha y hora" value={formatDateTime(range.startAt)} />
                            <SummaryRow label="Horario" value={formatTimeRange(range.startAt, range.endAt)} />
                            <SummaryRow
                                label="Duración"
                                value={`${bookingHours(range.startAt, range.endAt)} h × ${formatCOP(tutor.hourlyRate)}`}
                            />
                        </dl>
                        <div className="flex items-baseline justify-between border-t border-line pt-3">
                            <span className="font-semibold">Total a pagar</span>
                            <span className="text-2xl font-extrabold">
                                {formatCOP(bookingTotal(tutor.hourlyRate, range.startAt, range.endAt))}
                            </span>
                        </div>
                    </Card>

                    <Alert tone="info">El tutor debe confirmar tu reserva. Mientras tanto quedará como pendiente.</Alert>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button variant="secondary" size="lg" onClick={() => setStep("schedule")}>
                            Editar horario
                        </Button>
                        <SubmitButton size="lg" pendingText="Enviando reserva...">
                            Confirmar reserva
                        </SubmitButton>
                    </div>
                </form>
            </>
        );
    }

    return (
        <>
            <PageHeader eyebrow="Paso 2 de 3 · Elegir horario" title="Selecciona tu horario" />
            {children}

            <form onSubmit={handleContinue} noValidate className="mt-6 space-y-4">
                <Card className="space-y-4">
                    <Select
                        label="Materia"
                        name="subjectId"
                        placeholder="Elige una materia"
                        value={values.subjectId}
                        onChange={(e) => update("subjectId", e.target.value)}
                        options={tutor.subjects.map((s) => ({ value: s.id, label: `${s.name} · ${s.university}` }))}
                        error={errors.subjectId}
                        required
                    />
                    <Input
                        label="Fecha"
                        name="date"
                        type="date"
                        value={values.date}
                        onChange={(e) => update("date", e.target.value)}
                        hint="Hora de Colombia (UTC-5)."
                        error={errors.date}
                        required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Select
                            label="Hora de inicio"
                            name="startTime"
                            placeholder="Inicio"
                            value={values.startTime}
                            onChange={(e) => update("startTime", e.target.value)}
                            options={START_HOURS.map((h) => ({ value: h, label: h }))}
                            error={errors.startTime}
                            required
                        />
                        <Select
                            label="Hora de fin"
                            name="endTime"
                            placeholder="Fin"
                            value={values.endTime}
                            onChange={(e) => update("endTime", e.target.value)}
                            options={BOOKING_HOURS.filter((h) => !values.startTime || h > values.startTime).map((h) => ({
                                value: h,
                                label: h
                            }))}
                            error={errors.endTime}
                            required
                        />
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg">
                        Continuar
                    </Button>
                </div>
            </form>
        </>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</dt>
            <dd className="mt-0.5 font-medium text-ink">{value}</dd>
        </div>
    );
}
