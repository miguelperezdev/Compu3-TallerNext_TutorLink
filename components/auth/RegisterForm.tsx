"use client";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthFormState } from "@/app/(auth)/actions";
import { Input } from "@/components/form-ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { ROUTES } from "@/lib/routes";

const initialState: AuthFormState = {};

export function RegisterForm() {
    const [state, formAction] = useActionState(registerAction, initialState);
    const e = state.errors ?? {};

    return (
        <form action={formAction} className="flex flex-col gap-4" noValidate>
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Crea tu cuenta</h1>
                <p className="mt-1 text-sm text-ink-soft">
                    Toda cuenta nueva entra como estudiante. Si quieres dictar tutorías, un administrador te asignará el rol de tutor.
                </p>
            </div>

            {state.error && <Alert tone="danger">{state.error}</Alert>}

            <Input
                label="Nombre completo"
                name="fullName"
                autoComplete="name"
                defaultValue={state.fullName}
                placeholder="Ej. Ana Pérez"
                error={e.fullName}
                required
            />
            <Input
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                placeholder="tu@universidad.edu.co"
                error={e.email}
                required
            />
            <Input
                label="Contraseña"
                name="password"
                type="password"
                autoComplete="new-password"
                hint="Entre 8 y 16 caracteres."
                error={e.password}
                minLength={8}
                maxLength={16}
                required
            />
            <Input
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                error={e.confirmPassword}
                required
            />
            <SubmitButton pendingText="Creando cuenta..." fullWidth size="lg">
                Crear cuenta
            </SubmitButton>

            <p className="text-center text-sm text-ink-soft">
                ¿Ya tienes cuenta?{" "}
                <Link href={ROUTES.login} className="font-semibold text-brand-700 hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </form>
    );
}
