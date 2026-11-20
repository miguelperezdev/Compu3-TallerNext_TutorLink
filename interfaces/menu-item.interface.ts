import type { ReactNode } from "react";
import type { UserRole } from "./user.interface";

export interface MenuItem {
    path: string;
    icon: ReactNode;
    title: string;
    subtitle: string;
    /** Roles que ven el ítem. */
    roles: UserRole[];
    /** Si es true, el ítem se activa solo con la ruta exacta. */
    exact?: boolean;
}
