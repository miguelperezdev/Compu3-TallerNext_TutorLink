"use client";
import { useActionState, useState } from "react";
import { transitionBookingAction, type TransitionState } from "@/app/(app)/mis-tutorias/actions";
import { Alert } from "@/components/ui/Alert";
import { Button, LinkButton } from "@/components/ui/Button";
import type { BookingAction } from "@/lib/booking-utils";
import { ROUTES } from "@/lib/routes";

const initialState: TransitionState = {};

/**
 * Botones de una reserva según rol y estado (las calcula el servidor con `getAvailableActions`).
 * Cancelar pide confirmación en la propia tarjeta (sin window.confirm).
 */
export function BookingActions({ bookingId, actions }: { bookingId: string; actions: BookingAction[] }) {
    const [state, formAction, pending] = useActionState(transitionBookingAction, initialState);
    const [confirmingCancel, setConfirmingCancel] = useState(false);

    if (actions.length === 0) return null;

    return (
        <form action={formAction} className="flex w-full flex-col gap-2">
            <input type="hidden" name="bookingId" value={bookingId} />

            {state.error && <Alert tone="danger">{state.error}</Alert>}

            {confirmingCancel ? (
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">¿Seguro que quieres cancelar esta tutoría?</p>
                    <Button type="submit" name="intent" value="cancel" variant="danger" size="sm" disabled={pending}>
                        {pending ? "Cancelando..." : "Sí, cancelar"}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pending}
                        onClick={() => setConfirmingCancel(false)}
                    >
                        No, volver
                    </Button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {actions.includes("confirm") && (
                        <Button type="submit" name="intent" value="confirm" size="sm" disabled={pending}>
                            {pending ? "Confirmando..." : "Confirmar"}
                        </Button>
                    )}
                    {actions.includes("complete") && (
                        <Button type="submit" name="intent" value="complete" variant="success" size="sm" disabled={pending}>
                            {pending ? "Guardando..." : "Marcar completada"}
                        </Button>
                    )}
                    {actions.includes("review") && (
                        <LinkButton href={ROUTES.newReview(bookingId)} size="sm">
                            Calificar
                        </LinkButton>
                    )}
                    {actions.includes("cancel") && (
                        <Button variant="secondary" size="sm" disabled={pending} onClick={() => setConfirmingCancel(true)}>
                            Cancelar
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
}
