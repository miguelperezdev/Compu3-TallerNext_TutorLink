import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
    info: "border-brand-200 bg-brand-50 text-brand-800",
    success: "border-success-100 bg-success-50 text-success-700",
    warning: "border-warning-100 bg-warning-50 text-warning-700",
    danger: "border-danger-100 bg-danger-50 text-danger-700"
};

export function Alert({ tone = "info", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
    return (
        <div
            role={tone === "danger" ? "alert" : "status"}
            className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone], className)}
        >
            {children}
        </div>
    );
}
