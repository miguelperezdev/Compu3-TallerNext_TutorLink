import Link from "next/link";
import { Suspense } from "react";
import { Brand } from "@/components/Brand";
import { Avatar } from "@/components/ui/Avatar";
import { navItemsFor } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";
import { ROUTES } from "@/lib/routes";
import { NavLinks } from "./NavLinks";
import { LogoutButton } from "./LogoutButton";

async function TopbarUser() {
    const user = await getCurrentUser();
    if (!user) return null;
    return (
        <div className="flex items-center gap-3">
            <Avatar name={user.fullName} size="sm" />
            <LogoutButton className="text-ink-soft hover:text-ink" label="Salir" />
        </div>
    );
}

/** Barra superior móvil (< lg). */
export function MobileTopbar() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
            <Link href={ROUTES.home} className="text-lg">
                <Brand />
            </Link>
            <Suspense>
                <TopbarUser />
            </Suspense>
        </header>
    );
}

async function BottomNavItems() {
    const user = await getCurrentUser();
    return (
        <Suspense>
            <NavLinks items={navItemsFor(user?.roles ?? [])} variant="bottom" />
        </Suspense>
    );
}

/** Barra de pestañas inferior móvil, como en el prototipo. */
export function BottomNav() {
    return (
        <nav
            aria-label="Principal"
            className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
            <Suspense>
                <BottomNavItems />
            </Suspense>
        </nav>
    );
}
