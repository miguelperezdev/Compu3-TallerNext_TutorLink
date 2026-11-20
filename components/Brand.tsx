import { cn } from "@/lib/cn";

type BrandProps = { className?: string; tone?: "dark" | "light" };

/** Logotipo: "Tutor" + "Link" en azul. `tone="light"` para fondos oscuros. */
export function Brand({ className, tone = "dark" }: BrandProps) {
    return (
        <span className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}>
            <span
                aria-hidden
                className="grid size-8 place-items-center rounded-lg bg-brand-600 text-sm text-white shadow-sm"
            >
                TL
            </span>
            <span className={tone === "light" ? "text-white" : "text-ink"}>
                Tutor<span className={tone === "light" ? "text-brand-300" : "text-brand-600"}>Link</span>
            </span>
        </span>
    );
}
