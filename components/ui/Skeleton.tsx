import { cn } from "@/lib/cn";

/** Bloque gris animado para fallbacks de <Suspense>. */
export function Skeleton({ className }: { className?: string }) {
    return <div aria-hidden className={cn("animate-pulse rounded-lg bg-line", className)} />;
}
