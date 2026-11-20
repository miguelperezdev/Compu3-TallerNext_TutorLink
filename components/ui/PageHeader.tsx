import type { ReactNode } from "react";

export function PageHeader({
    title,
    description,
    eyebrow,
    action
}: {
    title: string;
    description?: string;
    /** Texto pequeño sobre el título, p. ej. "Paso 1 de 3". */
    eyebrow?: string;
    action?: ReactNode;
}) {
    return (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">{eyebrow}</p>
                )}
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
                {description && <p className="mt-1 max-w-2xl text-ink-soft">{description}</p>}
            </div>
            {action}
        </header>
    );
}
