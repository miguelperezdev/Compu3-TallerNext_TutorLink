import type { SelectHTMLAttributes } from "react";
import { Field, describedBy } from "./Field";
import { fieldClasses } from "./fieldStyles";

export type SelectOption = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    name: string;
    options: SelectOption[];
    /** Texto de la opción vacía (value=""). Si no se pasa, no se muestra. */
    placeholder?: string;
    hint?: string;
    error?: string;
};

export function Select({ label, name, options, placeholder, hint, error, className = "", ...props }: SelectProps) {
    return (
        <Field label={label} name={name} hint={hint} error={error}>
            <select
                id={name}
                name={name}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(name, hint, error)}
                className={fieldClasses(!!error, className)}
                {...props}
            >
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}
