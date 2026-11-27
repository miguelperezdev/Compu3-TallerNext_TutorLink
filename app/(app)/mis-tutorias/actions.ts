"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api";
import { transitionBooking } from "@/lib/booking-api";
import { ROUTES } from "@/lib/routes";
import { requireRole } from "@/lib/session";
import { UserRole } from "@/interfaces/user.interface";

export type TransitionState = { error?: string; done?: boolean };

const TRANSITIONS = ["confirm", "cancel", "complete"] as const;
type Transition = (typeof TRANSITIONS)[number];

function isTransition(value: string): value is Transition {
    return (TRANSITIONS as readonly string[]).includes(value);
}

/** Confirmar / completar (tutor dueño) o cancelar (estudiante o tutor dueño). */
export async function transitionBookingAction(_prev: TransitionState, formData: FormData): Promise<TransitionState> {
    const id = String(formData.get("bookingId") ?? "");
    const intent = String(formData.get("intent") ?? "");

    // Las Server Actions se saltan el proxy: se revalida sesión y rol aquí.
    const session = await requireRole([UserRole.STUDENT, UserRole.TUTOR], ROUTES.bookings);

    if (!id || !isTransition(intent)) return { error: "La acción solicitada no es válida." };

    try {
        await transitionBooking(session.token, id, intent);
    } catch (error) {
        if (isApiError(error)) {
            if (error.status === 401) {
                redirect(`${ROUTES.sessionExpired}?from=${encodeURIComponent(ROUTES.bookings)}`);
            }
            if (error.status === 403) return { error: "No tienes permiso para esta acción sobre la reserva." };
            if (error.status === 404) return { error: "No encontramos la reserva. Puede que ya no exista." };
            if (error.status === 400 || error.status === 409) {
                // Estado inválido (p. ej. ya fue cancelada desde otro lado).
                revalidatePath(ROUTES.bookings);
                return { error: error.message };
            }
        }
        return { error: "No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos." };
    }

    // Reservas no se cachean, pero esto invalida el caché de rutas del cliente (lista y "Próximas tutorías").
    revalidatePath(ROUTES.bookings);
    revalidatePath(ROUTES.studentHome);
    return { done: true };
}
