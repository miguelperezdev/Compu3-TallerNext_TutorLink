import type { ReactNode } from "react";

export function EmptyState({
    icon,
    title,
    description,
    action
}: {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
            {icon && <span className="text-4xl text-brand-300">{icon}</span>}
            <h3 className="text-lg font-bold">{title}</h3>
            {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
            {action}
        </div>
    );
}
