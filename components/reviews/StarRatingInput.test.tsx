import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { StarRatingInput } from "./StarRatingInput";

function Harness({ initial = 0, error, onChange }: { initial?: number; error?: string; onChange?: (n: number) => void }) {
    const [value, setValue] = useState(initial);
    return (
        <StarRatingInput
            name="rating"
            value={value}
            error={error}
            onChange={(n) => {
                setValue(n);
                onChange?.(n);
            }}
        />
    );
}

describe("StarRatingInput", () => {
    it("expone 5 opciones de radio dentro de un grupo con leyenda", () => {
        render(<Harness />);
        expect(screen.getByRole("group", { name: /tu calificación/i })).toBeInTheDocument();
        expect(screen.getAllByRole("radio")).toHaveLength(5);
        expect(screen.getByRole("radio", { name: "1 estrella" })).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: "5 estrellas" })).toBeInTheDocument();
    });

    it("no tiene ninguna opción seleccionada al inicio", () => {
        render(<Harness />);
        for (const radio of screen.getAllByRole("radio")) expect(radio).not.toBeChecked();
    });

    it("selecciona la calificación al hacer clic y avisa con onChange", async () => {
        const onChange = vi.fn();
        render(<Harness onChange={onChange} />);

        await userEvent.click(screen.getByRole("radio", { name: "4 estrellas" }));

        expect(onChange).toHaveBeenCalledWith(4);
        expect(screen.getByRole("radio", { name: "4 estrellas" })).toBeChecked();
        expect(screen.getByRole("radio", { name: "5 estrellas" })).not.toBeChecked();
    });

    it("permite cambiar la calificación", async () => {
        render(<Harness initial={2} />);
        expect(screen.getByRole("radio", { name: "2 estrellas" })).toBeChecked();

        await userEvent.click(screen.getByRole("radio", { name: "5 estrellas" }));

        expect(screen.getByRole("radio", { name: "5 estrellas" })).toBeChecked();
        expect(screen.getByRole("radio", { name: "2 estrellas" })).not.toBeChecked();
    });

    it("se opera con teclado (flechas entre opciones)", async () => {
        const onChange = vi.fn();
        render(<Harness initial={3} onChange={onChange} />);

        await userEvent.tab();
        expect(screen.getByRole("radio", { name: "3 estrellas" })).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        expect(onChange).toHaveBeenLastCalledWith(4);
        expect(screen.getByRole("radio", { name: "4 estrellas" })).toBeChecked();
    });

    it("envía el valor elegido con el nombre del campo", async () => {
        render(
            <form aria-label="reseña">
                <Harness />
            </form>
        );
        await userEvent.click(screen.getByRole("radio", { name: "3 estrellas" }));

        const form = screen.getByRole("form", { name: "reseña" }) as HTMLFormElement;
        expect(new FormData(form).get("rating")).toBe("3");
    });

    it("muestra el error como alerta y lo asocia al grupo", () => {
        render(<Harness error="Elige una calificación de 1 a 5 estrellas." />);
        expect(screen.getByRole("alert")).toHaveTextContent("Elige una calificación");
        expect(screen.getByRole("group")).toHaveAttribute("aria-describedby", "rating-error");
    });

    it("no muestra alerta si no hay error", () => {
        render(<Harness />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
