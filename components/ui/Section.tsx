import type { ReactNode } from "react";

/** Bloque con título y acción opcional ("Ver todos"). */
export function Section({
    title,
    action,
    children,
    id
}: {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    id?: string;
}) {
    return (
        <section id={id} className="mb-8">
            <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-soft">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}
