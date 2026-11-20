"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuItem } from "@/interfaces/menu-item.interface";
import { cn } from "@/lib/cn";

type Props = { items: MenuItem[]; variant: "sidebar" | "bottom" };

function isActive(pathname: string, item: MenuItem) {
    if (item.exact) return pathname === item.path;
    return pathname === item.path || pathname.startsWith(item.path + "/");
}

/** Client Component: necesita usePathname para marcar el ítem activo. */
export function NavLinks({ items, variant }: Props) {
    const pathname = usePathname();

    if (variant === "bottom") {
        return (
            <>
                {items.map((item) => {
                    const active = isActive(pathname, item);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors",
                                active ? "text-brand-600" : "text-ink-muted hover:text-ink"
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="max-w-full truncate px-1">{item.title}</span>
                        </Link>
                    );
                })}
            </>
        );
    }

    return (
        <>
            {items.map((item) => {
                const active = isActive(pathname, item);
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                            active ? "bg-white/10 text-white" : "text-brand-100/80 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <span className={cn("text-xl", active ? "text-brand-300" : "text-brand-300/70")}>{item.icon}</span>
                        <span className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold">{item.title}</span>
                            <span className="text-xs text-brand-100/50">{item.subtitle}</span>
                        </span>
                    </Link>
                );
            })}
        </>
    );
}
