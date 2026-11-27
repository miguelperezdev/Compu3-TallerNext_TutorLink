import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { transitionBookingAction } from "@/app/(app)/mis-tutorias/actions";
import { BookingActions } from "./BookingActions";

vi.mock("@/app/(app)/mis-tutorias/actions", () => ({ transitionBookingAction: vi.fn() }));

const action = vi.mocked(transitionBookingAction);

/** Datos con los que la Server Action fue invocada la última vez. */
function lastFormData() {
    const call = action.mock.calls.at(-1);
    if (!call) throw new Error("La acción no fue llamada");
    return call[1];
}

afterEach(() => {
    vi.clearAllMocks();
});

describe("BookingActions", () => {
    it("no renderiza nada si no hay acciones", () => {
        const { container } = render(<BookingActions bookingId="b1" actions={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("tutor con reserva pendiente: Confirmar y Cancelar", () => {
        render(<BookingActions bookingId="b1" actions={["confirm", "cancel"]} />);
        expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /marcar completada/i })).not.toBeInTheDocument();
    });

    it("tutor con reserva confirmada: Marcar completada y Cancelar", () => {
        render(<BookingActions bookingId="b1" actions={["complete", "cancel"]} />);
        expect(screen.getByRole("button", { name: "Marcar completada" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Confirmar" })).not.toBeInTheDocument();
    });

    it("estudiante con reserva completada: enlace a Calificar con el id de la reserva", () => {
        render(<BookingActions bookingId="b-42" actions={["review"]} />);
        expect(screen.getByRole("link", { name: "Calificar" })).toHaveAttribute("href", "/resenas/nueva?booking=b-42");
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("Confirmar envía bookingId e intent=confirm a la Server Action", async () => {
        action.mockResolvedValue({ done: true });
        render(<BookingActions bookingId="b1" actions={["confirm", "cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        expect(lastFormData().get("bookingId")).toBe("b1");
        expect(lastFormData().get("intent")).toBe("confirm");
    });

    it("Marcar completada envía intent=complete", async () => {
        action.mockResolvedValue({ done: true });
        render(<BookingActions bookingId="b1" actions={["complete", "cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Marcar completada" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        expect(lastFormData().get("intent")).toBe("complete");
    });

    it("Cancelar pide confirmación y NO llama a la acción todavía", async () => {
        render(<BookingActions bookingId="b1" actions={["cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(screen.getByText(/seguro que quieres cancelar/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sí, cancelar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "No, volver" })).toBeInTheDocument();
        expect(action).not.toHaveBeenCalled();
    });

    it("'No, volver' descarta la confirmación sin cancelar", async () => {
        render(<BookingActions bookingId="b1" actions={["confirm", "cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        await userEvent.click(screen.getByRole("button", { name: "No, volver" }));

        expect(screen.queryByText(/seguro que quieres cancelar/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
        expect(action).not.toHaveBeenCalled();
    });

    it("'Sí, cancelar' envía intent=cancel", async () => {
        action.mockResolvedValue({ done: true });
        render(<BookingActions bookingId="b9" actions={["cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        await userEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        expect(lastFormData().get("bookingId")).toBe("b9");
        expect(lastFormData().get("intent")).toBe("cancel");
    });

    it("muestra el error devuelto por la acción como alerta", async () => {
        action.mockResolvedValue({ error: "No tienes permiso para esta acción sobre la reserva." });
        render(<BookingActions bookingId="b1" actions={["confirm", "cancel"]} />);

        await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permiso");
    });
});
