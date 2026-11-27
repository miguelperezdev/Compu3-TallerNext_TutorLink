import { expect, test } from "@playwright/test";
import {
    STUDENT_EMAIL,
    TUTOR_EMAIL,
    bookTutor,
    findBookingCard,
    login,
    logout,
    openBookingFlow,
    randomSlot
} from "./helpers";

test.describe("Reservas · acceso y validaciones", () => {
    test("sin sesión, /mis-tutorias redirige al login conservando la ruta", async ({ page }) => {
        await page.goto("/mis-tutorias");
        await expect(page).toHaveURL(/\/login\?from=%2Fmis-tutorias/);
    });

    test("el formulario de reserva valida los campos antes de continuar", async ({ page }) => {
        await login(page, STUDENT_EMAIL);
        await openBookingFlow(page);

        await page.getByRole("button", { name: "Continuar" }).click();

        await expect(page.getByRole("alert").filter({ hasText: /materia/i })).toBeVisible();
        await expect(page.getByRole("alert").filter({ hasText: /fecha/i })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Selecciona tu horario" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Resumen de tu reserva" })).toHaveCount(0);
    });
});

test.describe("Reservas · flujo completo", () => {
    test("reservar → tutor confirma → tutor completa → estudiante reseña", async ({ page }) => {
        test.setTimeout(240_000);
        const slot = randomSlot();

        // 1) Estudiante reserva.
        await login(page, STUDENT_EMAIL);
        await bookTutor(page, slot);
        await page.getByRole("link", { name: "Ver mis tutorías" }).click();
        await expect(page).toHaveURL(/\/mis-tutorias/);

        const pendingForStudent = await findBookingCard(page, slot, "PENDING");
        await expect(pendingForStudent).toContainText("Pendiente");
        await expect(pendingForStudent.getByRole("button", { name: "Cancelar" })).toBeVisible();
        // El estudiante no puede confirmar.
        await expect(pendingForStudent.getByRole("button", { name: "Confirmar" })).toHaveCount(0);
        await logout(page);

        // 2) Tutor confirma y completa.
        await login(page, TUTOR_EMAIL);
        const pending = await findBookingCard(page, slot, "PENDING");
        await pending.getByRole("button", { name: "Confirmar" }).click();
        await expect(pending).toHaveCount(0);

        const confirmed = await findBookingCard(page, slot, "CONFIRMED");
        await expect(confirmed).toContainText("Confirmada");
        await confirmed.getByRole("button", { name: "Marcar completada" }).click();
        await expect(confirmed).toHaveCount(0);

        const completedForTutor = await findBookingCard(page, slot, "COMPLETED");
        await expect(completedForTutor).toContainText("Completada");
        await logout(page);

        // 3) Estudiante reseña.
        await login(page, STUDENT_EMAIL);
        const completed = await findBookingCard(page, slot, "COMPLETED");
        await completed.getByRole("link", { name: "Calificar" }).click();
        await expect(page.getByRole("heading", { name: "Calificar tutoría" })).toBeVisible();

        // Sin calificación ni comentario muestra errores y no envía.
        await page.getByRole("button", { name: "Enviar reseña" }).click();
        await expect(page.getByRole("alert").filter({ hasText: /calificación/i })).toBeVisible();

        await page.getByRole("radio", { name: "5 estrellas" }).check({ force: true });
        await page.getByLabel("Comentario").fill("Excelente tutoría, explicó todo muy claro.");
        await page.getByRole("button", { name: "Enviar reseña" }).click();

        await expect(page.getByRole("heading", { name: "¡Gracias por tu reseña!" })).toBeVisible();
    });

    test("el estudiante puede cancelar una reserva pendiente con confirmación", async ({ page }) => {
        test.setTimeout(180_000);
        const slot = randomSlot();

        await login(page, STUDENT_EMAIL);
        await bookTutor(page, slot);

        const card = await findBookingCard(page, slot, "PENDING");
        await card.getByRole("button", { name: "Cancelar" }).click();
        await expect(card.getByText(/seguro que quieres cancelar/i)).toBeVisible();

        // "No, volver" no cancela.
        await card.getByRole("button", { name: "No, volver" }).click();
        await expect(card.getByRole("button", { name: "Cancelar" })).toBeVisible();

        await card.getByRole("button", { name: "Cancelar" }).click();
        await card.getByRole("button", { name: "Sí, cancelar" }).click();
        await expect(card).toHaveCount(0);

        const cancelled = await findBookingCard(page, slot, "CANCELLED");
        await expect(cancelled).toContainText("Cancelada");
    });
});
