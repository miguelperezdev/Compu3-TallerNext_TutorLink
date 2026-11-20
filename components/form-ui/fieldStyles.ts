import { cn } from "@/lib/cn";

/** Clases compartidas por Input, Select y Textarea. */
export function fieldClasses(hasError: boolean, extra = "") {
    return cn(
        "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted",
        "transition-colors focus:outline-none focus:ring-2",
        hasError
            ? "border-danger-600 focus:ring-danger-100"
            : "border-line hover:border-brand-300 focus:border-brand-500 focus:ring-brand-100",
        extra
    );
}
