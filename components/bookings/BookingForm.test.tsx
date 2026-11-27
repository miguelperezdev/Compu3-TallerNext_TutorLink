import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createBookingAction } from "@/app/(app)/reservar/[tutorId]/actions";
import { makeBooking, makeSubject } from "@/test/fixtures";
import { BookingForm } from "./BookingForm";

vi.mock("@/app/(app)/reservar/[tutorId]/actions", () => ({ createBookingAction: vi.fn() }));

const action = vi.mocked(createBookingAction);

const subjects = [
    makeSubject({ id: "s1", name: "Cálculo I", university: "Icesi" }),
    makeSubject({ id: "s2", name: "Álgebra Lineal", university: "Icesi" })
];
const tutor = { id: "tutor-profile-1", fullName: "Carlos Tutor", hourlyRate: 15000, subjects };

// Fecha lejana para que siempre sea "futuro" sin depender del reloj.
const FUTURE_DATE = "2099-01-15";

function renderForm(overrides: Partial<typeof tutor> = {}) {
    return render(
        <BookingForm tutor={{ ...tutor, ...overrides }}>
            <div>Cabecera del tutor</div>
        </BookingForm>
    );
}

async function fillSchedule({ subject = "s1", start = "10:00", end = "12:00" } = {}) {
    await userEvent.selectOptions(screen.getByLabelText("Materia"), subject);
    const date = screen.getByLabelText("Fecha") as HTMLInputElement;
    await userEvent.clear(date);
    await userEvent.type(date, FUTURE_DATE);
    await userEvent.selectOptions(screen.getByLabelText("Hora de inicio"), start);
    await userEvent.selectOptions(screen.getByLabelText("Hora de fin"), end);
}

afterEach(() => {
    vi.clearAllMocks();
});

describe("BookingForm · paso 1 (horario)", () => {
    it("muestra el paso, el encabezado del tutor y los campos", () => {
        renderForm();
        expect(screen.getByText(/paso 2 de 3/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Selecciona tu horario" })).toBeInTheDocument();
        expect(screen.getByText("Cabecera del tutor")).toBeInTheDocument();
        expect(screen.getByLabelText("Materia")).toBeInTheDocument();
        expect(screen.getByLabelText("Fecha")).toBeInTheDocument();
        expect(screen.getByLabelText("Hora de inicio")).toBeInTheDocument();
        expect(screen.getByLabelText("Hora de fin")).toBeInTheDocument();
    });

    it("solo ofrece las materias del tutor", () => {
        renderForm();
        const options = within(screen.getByLabelText("Materia")).getAllByRole("option");
        expect(options.map((o) => o.textContent)).toEqual(["Elige una materia", "Cálculo I · Icesi", "Álgebra Lineal · Icesi"]);
    });

    it("preselecciona la materia si el tutor solo dicta una", () => {
        renderForm({ subjects: [subjects[0]] });
        expect(screen.getByLabelText("Materia")).toHaveValue("s1");
    });

    it("no ofrece fin <= inicio y limpia un fin que quedó inválido", async () => {
        renderForm();
        await userEvent.selectOptions(screen.getByLabelText("Hora de inicio"), "10:00");
        await userEvent.selectOptions(screen.getByLabelText("Hora de fin"), "12:00");

        const endValues = () =>
            within(screen.getByLabelText("Hora de fin"))
                .getAllByRole("option")
                .map((o) => (o as HTMLOptionElement).value);
        expect(endValues()).not.toContain("09:00");
        expect(endValues()).not.toContain("10:00");
        expect(endValues()).toContain("11:00");

        await userEvent.selectOptions(screen.getByLabelText("Hora de inicio"), "13:00");
        expect(screen.getByLabelText("Hora de fin")).toHaveValue("");
    });

    it("al continuar vacío muestra errores por campo y no avanza", async () => {
        renderForm();
        await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

        const alerts = screen.getAllByRole("alert").map((a) => a.textContent);
        expect(alerts.some((t) => /materia/i.test(t ?? ""))).toBe(true);
        expect(alerts.some((t) => /fecha/i.test(t ?? ""))).toBe(true);
        expect(alerts.some((t) => /inicio/i.test(t ?? ""))).toBe(true);
        expect(alerts.some((t) => /fin/i.test(t ?? ""))).toBe(true);
        expect(screen.queryByText(/resumen de tu reserva/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText("Materia")).toHaveAttribute("aria-invalid", "true");
    });

    it("rechaza una fecha pasada con mensaje junto al campo", async () => {
        renderForm();
        await userEvent.selectOptions(screen.getByLabelText("Materia"), "s1");
        const date = screen.getByLabelText("Fecha") as HTMLInputElement;
        await userEvent.type(date, "2000-01-01");
        await userEvent.selectOptions(screen.getByLabelText("Hora de inicio"), "10:00");
        await userEvent.selectOptions(screen.getByLabelText("Hora de fin"), "12:00");
        await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

        expect(screen.getByRole("alert")).toHaveTextContent(/futuro/i);
        expect(screen.queryByText(/resumen de tu reserva/i)).not.toBeInTheDocument();
    });

    it("limpia el error de un campo al corregirlo", async () => {
        renderForm();
        await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
        expect(screen.getByLabelText("Materia")).toHaveAttribute("aria-invalid", "true");

        await userEvent.selectOptions(screen.getByLabelText("Materia"), "s1");
        expect(screen.getByLabelText("Materia")).not.toHaveAttribute("aria-invalid");
    });
});

describe("BookingForm · paso 2 (resumen)", () => {
    async function goToSummary(options?: Parameters<typeof fillSchedule>[0]) {
        renderForm();
        await fillSchedule(options);
        await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    }

    it("muestra el resumen con tutor, materia, duración y total = horas × tarifa", async () => {
        await goToSummary({ subject: "s2", start: "10:00", end: "12:00" });

        expect(screen.getByText(/paso 3 de 3/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Resumen de tu reserva" })).toBeInTheDocument();
        expect(screen.getByText("Carlos Tutor", { selector: "dd" })).toBeInTheDocument();
        expect(screen.getByText("Álgebra Lineal · Icesi")).toBeInTheDocument();
        expect(screen.getByText(/2 h ×/)).toBeInTheDocument();
        // 2 h × $15.000 = $30.000
        expect(screen.getByText(/30\.000/, { selector: "span" })).toBeInTheDocument();
        expect(screen.getByText(/el tutor debe confirmar/i)).toBeInTheDocument();
    });

    it("el total cambia con la duración", async () => {
        await goToSummary({ start: "08:00", end: "11:00" });
        expect(screen.getByText(/45\.000/, { selector: "span" })).toBeInTheDocument();
    });

    it("'Editar horario' vuelve al paso 1 conservando lo elegido", async () => {
        await goToSummary({ subject: "s2", start: "09:00", end: "10:00" });

        await userEvent.click(screen.getByRole("button", { name: "Editar horario" }));

        expect(screen.getByRole("heading", { name: "Selecciona tu horario" })).toBeInTheDocument();
        expect(screen.getByLabelText("Materia")).toHaveValue("s2");
        expect(screen.getByLabelText("Fecha")).toHaveValue(FUTURE_DATE);
        expect(screen.getByLabelText("Hora de inicio")).toHaveValue("09:00");
        expect(screen.getByLabelText("Hora de fin")).toHaveValue("10:00");
    });

    it("al confirmar envía tutor, materia, fecha y horas a la Server Action", async () => {
        action.mockResolvedValue({ booking: makeBooking() });
        await goToSummary({ subject: "s1", start: "10:00", end: "12:00" });

        await userEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        const data = action.mock.calls[0][1];
        expect(data.get("tutorProfileId")).toBe("tutor-profile-1");
        expect(data.get("subjectId")).toBe("s1");
        expect(data.get("date")).toBe(FUTURE_DATE);
        expect(data.get("startTime")).toBe("10:00");
        expect(data.get("endTime")).toBe("12:00");
    });

    it("muestra la pantalla de éxito con accesos a mis tutorías e inicio", async () => {
        action.mockResolvedValue({
            booking: makeBooking({ subject: subjects[0] })
        });
        await goToSummary();

        await userEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));

        expect(await screen.findByRole("heading", { name: "¡Reserva enviada!" })).toBeInTheDocument();
        expect(screen.getByText(/pendiente de confirmación/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Ver mis tutorías" })).toHaveAttribute("href", "/mis-tutorias");
        expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/inicio");
    });

    it("si el servidor responde con error (solape) lo muestra y permite corregir sin perder datos", async () => {
        action.mockResolvedValue({ error: "El tutor ya tiene una reserva en ese horario. Elige otra franja." });
        await goToSummary({ subject: "s2", start: "10:00", end: "12:00" });

        await userEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(/ya tiene una reserva/i);
        expect(screen.queryByRole("heading", { name: "¡Reserva enviada!" })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Editar horario" }));
        expect(screen.getByLabelText("Materia")).toHaveValue("s2");
        expect(screen.getByLabelText("Hora de inicio")).toHaveValue("10:00");
    });

    it("muestra los errores de campo que devuelva el servidor", async () => {
        action.mockResolvedValue({ errors: { date: "La tutoría debe empezar en el futuro." } });
        await goToSummary();

        await userEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(/revisa el horario.*futuro/i);
    });
});
