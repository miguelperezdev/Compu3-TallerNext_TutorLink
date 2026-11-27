import { describe, expect, it } from "vitest";
import { BookingStatus } from "@/interfaces/booking.interface";
import { makeBooking, STUDENT_ID, TUTOR_USER_ID } from "@/test/fixtures";
import {
    BOOKING_HOURS,
    bookingHours,
    bookingTotal,
    filterBookingsByStatus,
    getAvailableActions,
    getBookingRole,
    getUpcomingBookings,
    parseBookingStatus,
    toBookingIso,
    validateSchedule
} from "./booking-utils";

const SUBJECTS = ["subject-1", "subject-2"];
// 1 de diciembre de 2026, 08:00 en Bogotá.
const NOW = new Date("2026-12-01T13:00:00.000Z").getTime();

describe("toBookingIso", () => {
    it("convierte hora de Bogotá (UTC-5) a ISO UTC", () => {
        expect(toBookingIso("2026-12-09", "10:00")).toBe("2026-12-09T15:00:00.000Z");
    });

    it("rechaza formatos inválidos", () => {
        expect(toBookingIso("", "10:00")).toBeNull();
        expect(toBookingIso("09/12/2026", "10:00")).toBeNull();
        expect(toBookingIso("2026-12-09", "10")).toBeNull();
        expect(toBookingIso("2026-13-45", "10:00")).toBeNull();
    });
});

describe("BOOKING_HOURS", () => {
    it("genera franjas de 1 h entre 08:00 y 20:00", () => {
        expect(BOOKING_HOURS).toHaveLength(13);
        expect(BOOKING_HOURS[0]).toBe("08:00");
        expect(BOOKING_HOURS.at(-1)).toBe("20:00");
    });
});

describe("bookingHours y bookingTotal", () => {
    it("calcula horas y total = horas × tarifa", () => {
        const start = "2026-12-09T15:00:00.000Z";
        const end = "2026-12-09T17:00:00.000Z";
        expect(bookingHours(start, end)).toBe(2);
        expect(bookingTotal(15000, start, end)).toBe(30000);
    });

    it("soporta fracciones de hora y redondea al peso", () => {
        const start = "2026-12-09T15:00:00.000Z";
        const end = "2026-12-09T15:30:00.000Z";
        expect(bookingHours(start, end)).toBe(0.5);
        expect(bookingTotal(15001, start, end)).toBe(7501);
    });
});

describe("validateSchedule", () => {
    const valid = { subjectId: "subject-1", date: "2026-12-09", startTime: "10:00", endTime: "12:00" };

    it("acepta un horario válido y devuelve el rango ISO", () => {
        const result = validateSchedule(valid, SUBJECTS, NOW);
        expect(result.errors).toEqual({});
        expect(result.startAt).toBe("2026-12-09T15:00:00.000Z");
        expect(result.endAt).toBe("2026-12-09T17:00:00.000Z");
    });

    it("exige materia, fecha y horas", () => {
        const { errors } = validateSchedule({ subjectId: "", date: "", startTime: "", endTime: "" }, SUBJECTS, NOW);
        expect(Object.keys(errors).sort()).toEqual(["date", "endTime", "startTime", "subjectId"]);
    });

    it("rechaza una materia que el tutor no dicta", () => {
        const { errors } = validateSchedule({ ...valid, subjectId: "otra" }, SUBJECTS, NOW);
        expect(errors.subjectId).toMatch(/materia/i);
    });

    it("rechaza una tutoría que empieza en el pasado", () => {
        const result = validateSchedule({ ...valid, date: "2026-11-30" }, SUBJECTS, NOW);
        expect(result.errors.date).toMatch(/futuro/i);
        expect(result.startAt).toBeUndefined();
    });

    it("rechaza fin igual o anterior al inicio", () => {
        expect(validateSchedule({ ...valid, endTime: "10:00" }, SUBJECTS, NOW).errors.endTime).toMatch(/posterior/i);
        expect(validateSchedule({ ...valid, endTime: "09:00" }, SUBJECTS, NOW).errors.endTime).toMatch(/posterior/i);
    });

    it("rechaza una fecha inexistente", () => {
        const result = validateSchedule({ ...valid, date: "2026-02-31" }, SUBJECTS, NOW);
        expect(result.errors.date).toBeDefined();
    });
});

describe("parseBookingStatus", () => {
    it("acepta solo valores del enum", () => {
        expect(parseBookingStatus("PENDING")).toBe(BookingStatus.PENDING);
        expect(parseBookingStatus("COMPLETED")).toBe(BookingStatus.COMPLETED);
    });

    it("devuelve undefined para valores inválidos o vacíos", () => {
        expect(parseBookingStatus("pending")).toBeUndefined();
        expect(parseBookingStatus("DROP TABLE")).toBeUndefined();
        expect(parseBookingStatus("")).toBeUndefined();
    });
});

describe("filterBookingsByStatus", () => {
    const bookings = [
        makeBooking({ id: "a", status: BookingStatus.PENDING }),
        makeBooking({ id: "b", status: BookingStatus.CANCELLED }),
        makeBooking({ id: "c", status: BookingStatus.COMPLETED })
    ];

    it("sin estado devuelve todas", () => {
        expect(filterBookingsByStatus(bookings)).toHaveLength(3);
    });

    it("filtra por estado en el cliente", () => {
        expect(filterBookingsByStatus(bookings, BookingStatus.COMPLETED).map((b) => b.id)).toEqual(["c"]);
        expect(filterBookingsByStatus(bookings, BookingStatus.CONFIRMED)).toEqual([]);
    });
});

describe("getBookingRole", () => {
    it("es tutor si el perfil de la reserva es del usuario", () => {
        expect(getBookingRole(makeBooking(), TUTOR_USER_ID)).toBe("tutor");
    });

    it("es estudiante en cualquier otro caso", () => {
        expect(getBookingRole(makeBooking(), STUDENT_ID)).toBe("student");
    });
});

describe("getAvailableActions", () => {
    const booking = (status: BookingStatus) => makeBooking({ status });

    it("tutor: pendiente -> confirmar y cancelar", () => {
        expect(getAvailableActions(booking(BookingStatus.PENDING), TUTOR_USER_ID)).toEqual(["confirm", "cancel"]);
    });

    it("tutor: confirmada -> completar y cancelar", () => {
        expect(getAvailableActions(booking(BookingStatus.CONFIRMED), TUTOR_USER_ID)).toEqual(["complete", "cancel"]);
    });

    it("tutor: completada o cancelada -> sin acciones", () => {
        expect(getAvailableActions(booking(BookingStatus.COMPLETED), TUTOR_USER_ID)).toEqual([]);
        expect(getAvailableActions(booking(BookingStatus.CANCELLED), TUTOR_USER_ID)).toEqual([]);
    });

    it("estudiante: pendiente o confirmada -> solo cancelar", () => {
        expect(getAvailableActions(booking(BookingStatus.PENDING), STUDENT_ID)).toEqual(["cancel"]);
        expect(getAvailableActions(booking(BookingStatus.CONFIRMED), STUDENT_ID)).toEqual(["cancel"]);
    });

    it("estudiante: completada -> calificar", () => {
        expect(getAvailableActions(booking(BookingStatus.COMPLETED), STUDENT_ID)).toEqual(["review"]);
    });

    it("estudiante: cancelada -> sin acciones", () => {
        expect(getAvailableActions(booking(BookingStatus.CANCELLED), STUDENT_ID)).toEqual([]);
    });

    it("el estudiante nunca puede confirmar ni completar", () => {
        for (const status of Object.values(BookingStatus)) {
            const actions = getAvailableActions(booking(status), STUDENT_ID);
            expect(actions).not.toContain("confirm");
            expect(actions).not.toContain("complete");
        }
    });
});

describe("getUpcomingBookings", () => {
    it("incluye solo pendientes/confirmadas que no terminaron, ordenadas por inicio", () => {
        const bookings = [
            makeBooking({ id: "later", startAt: "2026-12-20T15:00:00.000Z", endAt: "2026-12-20T16:00:00.000Z" }),
            makeBooking({ id: "sooner", startAt: "2026-12-05T15:00:00.000Z", endAt: "2026-12-05T16:00:00.000Z", status: BookingStatus.CONFIRMED }),
            makeBooking({ id: "past", startAt: "2026-11-01T15:00:00.000Z", endAt: "2026-11-01T16:00:00.000Z" }),
            makeBooking({ id: "cancelled", status: BookingStatus.CANCELLED, startAt: "2026-12-06T15:00:00.000Z", endAt: "2026-12-06T16:00:00.000Z" })
        ];
        expect(getUpcomingBookings(bookings, 5, NOW).map((b) => b.id)).toEqual(["sooner", "later"]);
    });

    it("respeta el límite", () => {
        const bookings = ["a", "b", "c"].map((id, i) =>
            makeBooking({ id, startAt: `2026-12-1${i}T15:00:00.000Z`, endAt: `2026-12-1${i}T16:00:00.000Z` })
        );
        expect(getUpcomingBookings(bookings, 2, NOW)).toHaveLength(2);
    });
});
