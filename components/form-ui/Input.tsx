import type { InputHTMLAttributes } from "react";
import { Field, describedBy } from "./Field";
import { fieldClasses } from "./fieldStyles";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    hint?: string;
    error?: string;
};

export function Input({ label, name, hint, error, className = "", ...props }: InputProps) {
    return (
        <Field label={label} name={name} hint={hint} error={error}>
            <input
                id={name}
                name={name}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(name, hint, error)}
                className={fieldClasses(!!error, className)}
                {...props}
            />
        </Field>
    );
}
