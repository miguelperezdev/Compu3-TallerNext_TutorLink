"use client";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { Button } from "./Button";

type Props = {
    children: ReactNode;
    pendingText?: string;
    variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
};

/**
 * Botón de envío que lee el estado del <form> padre con useFormStatus,
 * así no hay que pasarle `pending` a mano. Úsalo dentro de cualquier <form action={...}>.
 */
export function SubmitButton({ children, pendingText = "Guardando...", variant, fullWidth, size }: Props) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" variant={variant} fullWidth={fullWidth} size={size} disabled={pending} aria-busy={pending}>
            {pending ? pendingText : children}
        </Button>
    );
}
