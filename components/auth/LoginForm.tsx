"use client";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/app/(auth)/actions";
import { Input } from "@/components/form-ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { ROUTES } from "@/lib/routes";

const initialState: AuthFormState = {};

export function LoginForm({ from, expired }: { from?: string; expired?: boolean }) {
    const [state, formAction] = useActionState(loginAction, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-4" noValidate>
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Bienvenido de nuevo</h1>
                <p className="mt-1 text-sm text-ink-soft">Ingresa para reservar o gestionar tus tutorías.</p>
            </div>

            {expired && <Alert tone="warning">Tu sesión expiró. Vuelve a ingresar para continuar.</Alert>}
            {state.error && <Alert tone="danger">{state.error}</Alert>}

            {from && <input type="hidden" name="from" value={from} />}
            <Input
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                placeholder="tu@universidad.edu.co"
                required
            />
            <Input
                label="Contraseña"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                maxLength={16}
                required
            />
            <SubmitButton pendingText="Ingresando..." fullWidth size="lg">
                Ingresar
            </SubmitButton>

            <p className="text-center text-sm text-ink-soft">
                ¿No tienes cuenta?{" "}
                <Link href={ROUTES.register} className="font-semibold text-brand-700 hover:underline">
                    Regístrate
                </Link>
            </p>
        </form>
    );
}
