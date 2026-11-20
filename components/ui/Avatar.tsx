import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";

const sizes = { sm: "size-8 text-xs", md: "size-11 text-sm", lg: "size-16 text-xl", xl: "size-20 text-2xl" };

/** Avatar con iniciales (el backend no maneja fotos). */
export function Avatar({
    name,
    size = "md",
    className
}: {
    name: string;
    size?: keyof typeof sizes;
    className?: string;
}) {
    return (
        <span
            aria-hidden
            className={cn(
                "grid shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700",
                sizes[size],
                className
            )}
        >
            {getInitials(name)}
        </span>
    );
}
