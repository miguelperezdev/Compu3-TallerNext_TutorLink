import type { TextareaHTMLAttributes } from "react";
import { Field, describedBy } from "./Field";
import { fieldClasses } from "./fieldStyles";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    name: string;
    hint?: string;
    error?: string;
};

export function Textarea({ label, name, hint, error, className = "", rows = 4, ...props }: TextareaProps) {
    return (
        <Field label={label} name={name} hint={hint} error={error}>
            <textarea
                id={name}
                name={name}
                rows={rows}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(name, hint, error)}
                className={fieldClasses(!!error, className)}
                {...props}
            />
        </Field>
    );
}
