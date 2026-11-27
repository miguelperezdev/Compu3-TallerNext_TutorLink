import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createReviewAction } from "@/app/(app)/resenas/nueva/actions";
import { ReviewForm } from "./ReviewForm";

vi.mock("@/app/(app)/resenas/nueva/actions", () => ({ createReviewAction: vi.fn() }));

const action = vi.mocked(createReviewAction);

function renderForm() {
    return render(<ReviewForm bookingId="booking-7" tutorName="Carlos Tutor" />);
}

async function fillReview(stars = 5, comment = "Excelente tutor, muy claro") {
    await userEvent.click(screen.getByRole("radio", { name: stars === 1 ? "1 estrella" : `${stars} estrellas` }));
    await userEvent.type(screen.getByLabelText("Comentario"), comment);
}

afterEach(() => {
    vi.clearAllMocks();
});

describe("ReviewForm", () => {
    it("muestra las estrellas, el comentario y el botón de envío", () => {
        renderForm();
        expect(screen.getAllByRole("radio")).toHaveLength(5);
        expect(screen.getByLabelText("Comentario")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Enviar reseña" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/cuéntanos cómo te fue con carlos tutor/i)).toBeInTheDocument();
    });

    it("actualiza el contador de caracteres mientras se escribe", async () => {
        renderForm();
        expect(screen.getByText(/^0\/500 caracteres/)).toBeInTheDocument();

        await userEvent.type(screen.getByLabelText("Comentario"), "Muy bien");

        expect(screen.getByText(/^8\/500 caracteres/)).toBeInTheDocument();
    });

    it("limita el comentario a 500 caracteres", () => {
        renderForm();
        expect(screen.getByLabelText("Comentario")).toHaveAttribute("maxlength", "500");
    });

    it("envía id de reserva, calificación y comentario a la Server Action", async () => {
        action.mockResolvedValue({ done: true });
        renderForm();
        await fillReview(4, "Buena explicación");

        await userEvent.click(screen.getByRole("button", { name: "Enviar reseña" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        const data = action.mock.calls[0][1];
        expect(data.get("bookingId")).toBe("booking-7");
        expect(data.get("rating")).toBe("4");
        expect(data.get("comment")).toBe("Buena explicación");
    });

    it("tras guardar muestra la pantalla de gracias con el nombre del tutor y accesos", async () => {
        action.mockResolvedValue({ done: true });
        renderForm();
        await fillReview();

        await userEvent.click(screen.getByRole("button", { name: "Enviar reseña" }));

        expect(await screen.findByRole("heading", { name: "¡Gracias por tu reseña!" })).toBeInTheDocument();
        expect(screen.getByText(/carlos tutor ya quedó publicada/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Volver a mis tutorías" })).toHaveAttribute("href", "/mis-tutorias");
        expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/inicio");
        expect(screen.queryByRole("button", { name: "Enviar reseña" })).not.toBeInTheDocument();
    });

    it("muestra los errores por campo que devuelve la acción", async () => {
        action.mockResolvedValue({
            errors: {
                rating: "Elige una calificación de 1 a 5 estrellas.",
                comment: "Escribe un comentario de al menos 3 caracteres."
            }
        });
        renderForm();

        await userEvent.click(screen.getByRole("button", { name: "Enviar reseña" }));

        const alerts = await screen.findAllByRole("alert");
        expect(alerts.map((a) => a.textContent)).toEqual(
            expect.arrayContaining([
                "Elige una calificación de 1 a 5 estrellas.",
                "Escribe un comentario de al menos 3 caracteres."
            ])
        );
        expect(screen.getByLabelText("Comentario")).toHaveAttribute("aria-invalid", "true");
    });

    it("409: muestra 'Ya calificaste' y conserva lo escrito", async () => {
        action.mockResolvedValue({ error: "Ya calificaste esta sesión." });
        renderForm();
        await fillReview(3, "Estuvo bien");

        await userEvent.click(screen.getByRole("button", { name: "Enviar reseña" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Ya calificaste esta sesión.");
        expect(screen.getByLabelText("Comentario")).toHaveValue("Estuvo bien");
        expect(screen.getByRole("radio", { name: "3 estrellas" })).toBeChecked();
        expect(screen.queryByRole("heading", { name: "¡Gracias por tu reseña!" })).not.toBeInTheDocument();
    });
});
