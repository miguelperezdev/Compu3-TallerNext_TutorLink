import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api";
import { createBooking } from "@/lib/booking-api";
import { requireRole } from "@/lib/session";
import { getTutor } from "@/lib/tutor-api";
import { makeBooking, makeTutorProfile, makeUser } from "@/test/fixtures";
import { createBookingAction } from "./actions";

vi.mock("next/navigation", () => ({
    redirect: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
    })
}));
vi.mock("@/lib/session", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/booking-api", () => ({ createBooking: vi.fn() }));
vi.mock("@/lib/tutor-api", () => ({ getTutor: vi.fn() }));

const TUTOR_ID = "tutor-profile-1";

function formData(overrides: Record<string, string> = {}) {
    const data = new FormData();
    const fields = {
        tutorProfileId: TUTOR_ID,
        subjectId: "subject-1",
        date: "2026-12-09",
        startTime: "10:00",
        endTime: "12:00",
        ...overrides
    };
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
}

describe("createBookingAction", () => {
    beforeEach(() => {
        // 1 de diciembre de 2026: 9 de diciembre es futuro.
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-12-01T13:00:00.000Z"));
        vi.mocked(requireRole).mockResolvedValue({ token: "jwt", user: makeUser() });
        vi.mocked(getTutor).mockResolvedValue(makeTutorProfile({ id: TUTOR_ID }));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it("exige rol estudiante", async () => {
        vi.mocked(createBooking).mockResolvedValue(makeBooking());
        await createBookingAction({}, formData());
        expect(requireRole).toHaveBeenCalledWith(["student"], `/reservar/${TUTOR_ID}`);
    });

    it("crea la reserva con fechas ISO en UTC y devuelve la reserva", async () => {
        const booking = makeBooking();
        vi.mocked(createBooking).mockResolvedValue(booking);

        const state = await createBookingAction({}, formData());

        expect(createBooking).toHaveBeenCalledWith("jwt", {
            tutorProfileId: TUTOR_ID,
            subjectId: "subject-1",
            startAt: "2026-12-09T15:00:00.000Z",
            endAt: "2026-12-09T17:00:00.000Z"
        });
        expect(state.booking).toBe(booking);
        expect(state.error).toBeUndefined();
    });

    it("no llama a la API si el horario es inválido (pasado)", async () => {
        const state = await createBookingAction({}, formData({ date: "2026-11-30" }));
        expect(state.errors?.date).toBeDefined();
        expect(state.values?.date).toBe("2026-11-30");
        expect(createBooking).not.toHaveBeenCalled();
    });

    it("no llama a la API si la materia no es del tutor", async () => {
        const state = await createBookingAction({}, formData({ subjectId: "otra-materia" }));
        expect(state.errors?.subjectId).toBeDefined();
        expect(createBooking).not.toHaveBeenCalled();
    });

    it("no llama a la API si el fin no es posterior al inicio", async () => {
        const state = await createBookingAction({}, formData({ startTime: "12:00", endTime: "10:00" }));
        expect(state.errors?.endTime).toBeDefined();
        expect(createBooking).not.toHaveBeenCalled();
    });

    it("409: avisa del solape y conserva lo escrito", async () => {
        vi.mocked(createBooking).mockRejectedValue(new ApiError(409, "overlap"));
        const state = await createBookingAction({}, formData());
        expect(state.error).toMatch(/ya tiene una reserva/i);
        expect(state.values).toEqual({ subjectId: "subject-1", date: "2026-12-09", startTime: "10:00", endTime: "12:00" });
    });

    it("400: muestra el mensaje del backend", async () => {
        vi.mocked(createBooking).mockRejectedValue(new ApiError(400, "startAt must be in the future"));
        const state = await createBookingAction({}, formData());
        expect(state.error).toContain("startAt must be in the future");
    });

    it("403 y 404 tienen mensajes propios", async () => {
        vi.mocked(createBooking).mockRejectedValueOnce(new ApiError(403, "forbidden"));
        expect((await createBookingAction({}, formData())).error).toMatch(/permiso/i);

        vi.mocked(createBooking).mockRejectedValueOnce(new ApiError(404, "not found"));
        expect((await createBookingAction({}, formData())).error).toMatch(/no encontramos/i);
    });

    it("401: redirige a sesión vencida", async () => {
        vi.mocked(createBooking).mockRejectedValue(new ApiError(401, "jwt expired"));
        await expect(createBookingAction({}, formData())).rejects.toThrow("REDIRECT:/session-expired?from=");
    });

    it("error de red: mensaje genérico", async () => {
        vi.mocked(createBooking).mockRejectedValue(new Error("ECONNREFUSED"));
        const state = await createBookingAction({}, formData());
        expect(state.error).toMatch(/no pudimos conectar/i);
    });

    it("si el tutor no existe (404 al cargarlo) responde con mensaje y no crea nada", async () => {
        vi.mocked(getTutor).mockRejectedValue(new ApiError(404, "Tutor not found"));
        const state = await createBookingAction({}, formData());
        expect(state.error).toMatch(/no encontramos/i);
        expect(createBooking).not.toHaveBeenCalled();
    });
});
