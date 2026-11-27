import { BookingStatus, type Booking } from "@/interfaces/booking.interface";

/** Colombia no tiene horario de verano: el offset es fijo y el ISO resultante es determinista. */
const BOGOTA_OFFSET = "-05:00";

/** Franjas de 1 h entre 8:00 y 20:00 ("08:00", "09:00"...). */
export const BOOKING_HOURS = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

/** ("2026-12-01", "09:00") -> ISO UTC, o null si la fecha/hora no es válida. */
export function toBookingIso(date: string, time: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
    const parsed = new Date(`${date}T${time}:00${BOGOTA_OFFSET}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function bookingHours(startIso: string, endIso: string) {
    return (new Date(endIso).getTime() - new Date(startIso).getTime()) / 3_600_000;
}

/** Total en COP = horas × tarifa por hora. */
export function bookingTotal(hourlyRate: number, startIso: string, endIso: string) {
    return Math.round(hourlyRate * bookingHours(startIso, endIso));
}

export type ScheduleInput = { subjectId: string; date: string; startTime: string; endTime: string };
export type ScheduleErrors = Partial<Record<keyof ScheduleInput, string>>;

/**
 * Valida lo que el backend también valida (para dar el error junto al campo y sin viaje de red):
 * materia del tutor, fecha futura y fin posterior al inicio.
 */
export function validateSchedule(input: ScheduleInput, validSubjectIds: string[], now = Date.now()) {
    const errors: ScheduleErrors = {};

    if (!validSubjectIds.includes(input.subjectId)) errors.subjectId = "Elige una materia que dicte este tutor.";
    if (!input.date) errors.date = "Elige una fecha.";
    if (!input.startTime) errors.startTime = "Elige la hora de inicio.";
    if (!input.endTime) errors.endTime = "Elige la hora de fin.";
    if (Object.keys(errors).length > 0) return { errors };

    const startAt = toBookingIso(input.date, input.startTime);
    const endAt = toBookingIso(input.date, input.endTime);
    if (!startAt) return { errors: { date: "La fecha no es válida." } satisfies ScheduleErrors };
    if (!endAt) return { errors: { endTime: "La hora de fin no es válida." } satisfies ScheduleErrors };

    if (new Date(startAt).getTime() <= now) {
        errors.date = "La tutoría debe empezar en el futuro.";
    }
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
        errors.endTime = "La hora de fin debe ser posterior a la de inicio.";
    }
    if (Object.keys(errors).length > 0) return { errors };

    return { errors, startAt, endAt };
}

/** Reservas activas (pendientes o confirmadas) que aún no terminan, en orden de inicio. */
export function getUpcomingBookings(bookings: Booking[], limit = 2, now = Date.now()) {
    return bookings
        .filter(
            (b) =>
                (b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) &&
                new Date(b.endAt).getTime() > now
        )
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
        .slice(0, limit);
}
