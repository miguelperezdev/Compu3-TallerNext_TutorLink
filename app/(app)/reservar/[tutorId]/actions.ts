"use server";
import { redirect } from "next/navigation";
import { ApiError, isApiError } from "@/lib/api";
import { createBooking } from "@/lib/booking-api";
import { validateSchedule, type ScheduleErrors } from "@/lib/booking-utils";
import { ROUTES } from "@/lib/routes";
import { requireRole } from "@/lib/session";
import { getTutor } from "@/lib/tutor-api";
import { UserRole } from "@/interfaces/user.interface";
import type { Booking } from "@/interfaces/booking.interface";

export type BookingFormState = {
    /** Error general (409 solape, 400 regla de negocio, red...). */
    error?: string;
    /** Errores por campo. */
    errors?: ScheduleErrors;
    /** Valores a rehidratar al fallar. */
    values?: { subjectId: string; date: string; startTime: string; endTime: string };
    /** Reserva creada (pantalla de éxito). */
    booking?: Booking;
};

const NETWORK_ERROR = "No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.";

export async function createBookingAction(_prev: BookingFormState, formData: FormData): Promise<BookingFormState> {
    const tutorProfileId = String(formData.get("tutorProfileId") ?? "");
    const values = {
        subjectId: String(formData.get("subjectId") ?? ""),
        date: String(formData.get("date") ?? ""),
        startTime: String(formData.get("startTime") ?? ""),
        endTime: String(formData.get("endTime") ?? "")
    };

    // Las Server Actions se saltan el proxy: se revalida sesión y rol aquí.
    const session = await requireRole([UserRole.STUDENT], ROUTES.book(tutorProfileId));

    try {
        // La materia se valida contra el tutor real (no contra datos que manda el navegador).
        const tutor = await getTutor(session.token, tutorProfileId);
        const { errors, startAt, endAt } = validateSchedule(
            values,
            tutor.subjects.map((s) => s.id)
        );
        if (!startAt || !endAt) return { errors, values };

        const booking = await createBooking(session.token, {
            tutorProfileId,
            subjectId: values.subjectId,
            startAt,
            endAt
        });
        return { booking, values };
    } catch (error) {
        if (error instanceof ApiError || isApiError(error)) {
            if (error.status === 401) {
                redirect(`${ROUTES.sessionExpired}?from=${encodeURIComponent(ROUTES.book(tutorProfileId))}`);
            }
            if (error.status === 409) {
                return { error: "El tutor ya tiene una reserva en ese horario. Elige otra franja.", values };
            }
            if (error.status === 404) {
                return { error: "No encontramos al tutor o la materia. Vuelve a la búsqueda e inténtalo de nuevo.", values };
            }
            if (error.status === 403) {
                return { error: "Tu cuenta no tiene permiso para reservar tutorías.", values };
            }
            if (error.status === 400) {
                return { error: `No se pudo crear la reserva: ${error.message}`, values };
            }
        }
        return { error: NETWORK_ERROR, values };
    }
}
