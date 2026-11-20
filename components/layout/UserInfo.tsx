import { Avatar } from "@/components/ui/Avatar";
import { primaryRoleLabel } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";

/** Tarjeta del usuario conectado (Server Component: lee la cookie `user`). */
export async function UserInfo() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3" aria-label="Usuario conectado">
            <Avatar name={user.fullName} className="bg-brand-500 text-white" />
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                <p className="truncate text-xs text-brand-100/60">{primaryRoleLabel(user.roles)}</p>
            </div>
        </div>
    );
}
