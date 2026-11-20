import type { ReactNode } from "react";

type FieldShellProps = {
    label: string;
    name: string;
    hint?: string;
    error?: string;
    children: ReactNode;
};

/** Label + control + hint/error accesibles. Lo reutilizan Input, Select y Textarea. */
export function Field({ label, name, hint, error, children }: FieldShellProps) {
    return (
        <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor={name} className="font-semibold text-ink">
                {label}
            </label>
            {children}
            {hint && !error && (
                <span id={`${name}-hint`} className="text-xs text-ink-muted">
                    {hint}
                </span>
            )}
            {error && (
                <span id={`${name}-error`} role="alert" className="text-xs font-medium text-danger-600">
                    {error}
                </span>
            )}
        </div>
    );
}

export function describedBy(name: string, hint?: string, error?: string) {
    return error ? `${name}-error` : hint ? `${name}-hint` : undefined;
}
