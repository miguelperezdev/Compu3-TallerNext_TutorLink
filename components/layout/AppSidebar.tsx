import Link from "next/link";
import { Suspense } from "react";
import { Brand } from "@/components/Brand";
import { Skeleton } from "@/components/ui/Skeleton";
import { navItemsFor } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";
import { ROUTES } from "@/lib/routes";
import { NavLinks } from "./NavLinks";
import { UserInfo } from "./UserInfo";
import { LogoutButton } from "./LogoutButton";

async function SidebarNav() {
    const user = await getCurrentUser();
    return (
        <nav aria-label="Principal" className="flex flex-col gap-1 px-4">
            <Suspense>
                <NavLinks items={navItemsFor(user?.roles ?? [])} variant="sidebar" />
            </Suspense>
        </nav>
    );
}

/** Barra lateral de escritorio (lg+). En móvil se usa BottomNav. */
export function AppSidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto bg-brand-950 lg:flex">
            <div className="px-6 pt-8 pb-6">
                <Link href={ROUTES.home} className="text-xl">
                    <Brand tone="light" />
                </Link>
            </div>

            <div className="mb-4 px-4">
                <Suspense fallback={<Skeleton className="h-16 bg-white/10" />}>
                    <UserInfo />
                </Suspense>
            </div>

            <Suspense fallback={<div className="space-y-2 px-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12 bg-white/10" />)}</div>}>
                <SidebarNav />
            </Suspense>

            <div className="mt-auto px-6 py-6">
                <LogoutButton className="text-brand-100/70 hover:text-white" />
            </div>
        </aside>
    );
}
