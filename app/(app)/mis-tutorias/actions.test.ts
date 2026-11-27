import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api";
import { transitionBooking } from "@/lib/booking-api";
import { requireRole } from "@/lib/session";
import { makeBooking, makeUser } from "@/test/fixtures";
import { transitionBookingAction } from "./actions";

vi.mock("next/navigation", () => ({
    redirect: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
    })
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/session", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/booking-api", () => ({ transitionBooking: vi.fn() }));

function formData(bookingId: string, intent: string) {
    const data = new FormData();
    data.set("bookingId", bookingId);
    data.set("intent", intent);
    return data;
}

describe("transitionBookingAction", () => {
    beforeEach(() => {
        vi.mocked(requireRole).mockResolvedValue({ token: "jwt", user: makeUser() });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it.each(["confirm", "cancel", "complete"])("ejecuta %s con el token y revalida las listas", async (intent) => {
        vi.mocked(transitionBooking).mockResolvedValue(makeBooking());

        const state = await transitionBookingAction({}, formData("booking-1", intent));

        expect(transitionBooking).toHaveBeenCalledWith("jwt", "booking-1", intent);
        expect(revalidatePath).toHaveBeenCalledWith("/mis-tutorias");
        expect(revalidatePath).toHaveBeenCalledWith("/inicio");
        expect(state).toEqual({ done: true });
    });

    it("exige sesión de estudiante o tutor", async () => {
        vi.mocked(transitionBooking).mockResolvedValue(makeBooking());
        await transitionBookingAction({}, formData("booking-1", "cancel"));
        expect(requireRole).toHaveBeenCalledWith(["student", "tutor"], "/mis-tutorias");
    });

    it("rechaza acciones desconocidas sin llamar a la API", async () => {
        for (const intent of ["delete", "", "review", "CONFIRM"]) {
            const state = await transitionBookingAction({}, formData("booking-1", intent));
            expect(state.error).toMatch(/no es válida/i);
        }
        expect(transitionBooking).not.toHaveBeenCalled();
    });

    it("rechaza una acción sin id de reserva", async () => {
        const state = await transitionBookingAction({}, formData("", "confirm"));
        expect(state.error).toBeDefined();
        expect(transitionBooking).not.toHaveBeenCalled();
    });

    it("403: sin permiso sobre la reserva", async () => {
        vi.mocked(transitionBooking).mockRejectedValue(new ApiError(403, "forbidden"));
        expect((await transitionBookingAction({}, formData("b", "confirm"))).error).toMatch(/permiso/i);
    });

    it("404: la reserva ya no existe", async () => {
        vi.mocked(transitionBooking).mockRejectedValue(new ApiError(404, "not found"));
        expect((await transitionBookingAction({}, formData("b", "confirm"))).error).toMatch(/no encontramos/i);
    });

    it("400/409: muestra el mensaje del backend y refresca la lista", async () => {
        vi.mocked(transitionBooking).mockRejectedValue(new ApiError(400, "Booking cannot be cancelled in its current status"));
        const state = await transitionBookingAction({}, formData("b", "cancel"));
        expect(state.error).toContain("cannot be cancelled");
        expect(revalidatePath).toHaveBeenCalledWith("/mis-tutorias");
    });

    it("401: redirige a sesión vencida", async () => {
        vi.mocked(transitionBooking).mockRejectedValue(new ApiError(401, "jwt expired"));
        await expect(transitionBookingAction({}, formData("b", "confirm"))).rejects.toThrow("REDIRECT:/session-expired");
    });

    it("error de red: mensaje genérico", async () => {
        vi.mocked(transitionBooking).mockRejectedValue(new Error("ECONNREFUSED"));
        expect((await transitionBookingAction({}, formData("b", "confirm"))).error).toMatch(/no pudimos conectar/i);
    });
});
