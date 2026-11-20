import { UserRole } from "@/interfaces/user.interface";
import { ROUTES } from "./routes";

export function hasRole(userRoles: UserRole[], allowed: UserRole[]) {
    return allowed.some((role) => userRoles.includes(role));
}

/** Pantalla de entrada según el rol más alto (admin > tutor > student). */
export function homeForRoles(roles: UserRole[]): string {
    if (roles.includes(UserRole.ADMIN)) return ROUTES.adminUsers;
    if (roles.includes(UserRole.TUTOR)) return ROUTES.tutorPanel;
    return ROUTES.studentHome;
}

export const ROLE_LABEL: Record<UserRole, string> = {
    [UserRole.STUDENT]: "Estudiante",
    [UserRole.TUTOR]: "Tutor",
    [UserRole.ADMIN]: "Administrador"
};

export function primaryRoleLabel(roles: UserRole[]) {
    if (roles.includes(UserRole.ADMIN)) return ROLE_LABEL[UserRole.ADMIN];
    if (roles.includes(UserRole.TUTOR)) return ROLE_LABEL[UserRole.TUTOR];
    return ROLE_LABEL[UserRole.STUDENT];
}
