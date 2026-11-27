import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingStatus } from "@/interfaces/booking.interface";
import { BookingStatusFilter } from "./BookingStatusFilter";

describe("BookingStatusFilter", () => {
    it("muestra los cinco filtros dentro de una navegación etiquetada", () => {
        render(<BookingStatusFilter />);
        expect(screen.getByRole("navigation", { name: /filtrar por estado/i })).toBeInTheDocument();
        expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
            "Todas",
            "Pendientes",
            "Confirmadas",
            "Completadas",
            "Canceladas"
        ]);
    });

    it("cada filtro enlaza con ?status= (y 'Todas' con la ruta limpia)", () => {
        render(<BookingStatusFilter />);
        expect(screen.getByRole("link", { name: "Todas" })).toHaveAttribute("href", "/mis-tutorias");
        expect(screen.getByRole("link", { name: "Pendientes" })).toHaveAttribute("href", "/mis-tutorias?status=PENDING");
        expect(screen.getByRole("link", { name: "Confirmadas" })).toHaveAttribute("href", "/mis-tutorias?status=CONFIRMED");
        expect(screen.getByRole("link", { name: "Completadas" })).toHaveAttribute("href", "/mis-tutorias?status=COMPLETED");
        expect(screen.getByRole("link", { name: "Canceladas" })).toHaveAttribute("href", "/mis-tutorias?status=CANCELLED");
    });

    it("sin estado actual marca 'Todas' como página activa", () => {
        render(<BookingStatusFilter />);
        expect(screen.getByRole("link", { name: "Todas" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Pendientes" })).not.toHaveAttribute("aria-current");
    });

    it("marca solo el filtro del estado actual", () => {
        render(<BookingStatusFilter current={BookingStatus.COMPLETED} />);
        expect(screen.getByRole("link", { name: "Completadas" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Todas" })).not.toHaveAttribute("aria-current");
        expect(screen.getAllByRole("link").filter((l) => l.hasAttribute("aria-current"))).toHaveLength(1);
    });
});
