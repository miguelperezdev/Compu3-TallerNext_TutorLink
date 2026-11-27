import { expect, type Locator, type Page } from "@playwright/test";
import { toBookingIso } from "../lib/booking-utils";
import { formatDateTime } from "../lib/format";

export const PASSWORD = "Secreta123";
export const STUDENT_EMAIL = "ana@example.com";
export const TUTOR_EMAIL = "tutor1@example.com";
export const TUTOR_NAME = "Carlos Tutor";

export async function login(page: Page, email: string, password = PASSWORD) {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(email);
    await page.getByLabel("Contraseña").fill(password);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

export async function logout(page: Page) {
    // El botón existe en el sidebar (escritorio) y en el menú móvil: se usa el visible.
    await page.locator("button:visible", { hasText: "Cerrar sesión" }).first().click();
    await page.waitForURL(/\/login/);
}

export type Slot = { date: string; startTime: string; endTime: string; startIso: string };

/**
 * Horario aleatorio (de 1 h) en los próximos ~2 meses. Aleatorio para no chocar (409) con reservas
 * activas que hayan quedado de ejecuciones anteriores que fallaron a la mitad.
 */
export function randomSlot(): Slot {
    const offsetDays = 7 + Math.floor(Math.random() * 55);
    const day = new Date(Date.now() + offsetDays * 86_400_000);
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(day); // YYYY-MM-DD
    const hour = 8 + Math.floor(Math.random() * 12); // 8..19
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
    const startIso = toBookingIso(date, startTime);
    if (!startIso) throw new Error(`Horario inválido: ${date} ${startTime}`);
    return { date, startTime, endTime, startIso };
}

/** Desde la lista de tutores abre el perfil de Carlos Tutor y entra al flujo de reserva. */
export async function openBookingFlow(page: Page) {
    await page.goto("/tutores");
    await page.getByRole("link", { name: TUTOR_NAME }).first().click();
    await expect(page.getByRole("heading", { name: TUTOR_NAME })).toBeVisible();
    await page.getByRole("link", { name: "Reservar tutoría" }).click();
    await expect(page.getByRole("heading", { name: "Selecciona tu horario" })).toBeVisible();
}

export async function fillSchedule(page: Page, slot: Slot) {
    // `exact`: el buscador del menú también menciona "materia" en su aria-label.
    await page.getByLabel("Materia", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Fecha", { exact: true }).fill(slot.date);
    await page.getByLabel("Hora de inicio", { exact: true }).selectOption(slot.startTime);
    await page.getByLabel("Hora de fin", { exact: true }).selectOption(slot.endTime);
}

/** Estudiante: reserva a Carlos Tutor en el horario dado hasta ver "¡Reserva enviada!". */
export async function bookTutor(page: Page, slot: Slot) {
    await openBookingFlow(page);
    await fillSchedule(page, slot);
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Resumen de tu reserva" })).toBeVisible();
    await expect(page.getByText(/15\.000/).first()).toBeVisible(); // 1 h × $15.000
    await page.getByRole("button", { name: "Confirmar reserva" }).click();
    await expect(page.getByRole("heading", { name: "¡Reserva enviada!" })).toBeVisible();
}

/**
 * Abre /mis-tutorias (con el filtro dado) y busca la tarjeta de la reserva por su fecha/hora,
 * recorriendo las páginas del paginador.
 */
export async function findBookingCard(page: Page, slot: Slot, status?: string): Promise<Locator> {
    await page.goto(status ? `/mis-tutorias?status=${status}` : "/mis-tutorias");
    await expect(page.getByRole("heading", { name: "Mis tutorías" })).toBeVisible();

    const text = formatDateTime(slot.startIso);
    for (let i = 0; i < 40; i++) {
        const card = page.locator("article", { hasText: text }).first();
        if ((await card.count()) > 0) return card;

        const next = page.getByRole("link", { name: "Página siguiente" });
        if ((await next.count()) === 0) break;
        const before = page.url();
        await next.click();
        await page.waitForURL((url) => url.toString() !== before);
    }
    throw new Error(`No se encontró la reserva "${text}" en /mis-tutorias${status ? `?status=${status}` : ""}`);
}
