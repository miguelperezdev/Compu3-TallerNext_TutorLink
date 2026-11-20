import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

const tones: Record<Tone, string> = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    success: "bg-success-50 text-success-700 ring-success-100",
    warning: "bg-warning-50 text-warning-700 ring-warning-100",
    danger: "bg-danger-50 text-danger-700 ring-danger-100",
    neutral: "bg-canvas text-ink-soft ring-line"
};

export function Badge({
    tone = "neutral",
    className,
    ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                tones[tone],
                className
            )}
            {...props}
        />
    );
}
