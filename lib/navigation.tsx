import {
    IoCalendarOutline,
    IoHomeOutline,
    IoLibraryOutline,
    IoPeopleOutline,
    IoPersonCircleOutline,
    IoSearchOutline,
    IoShieldCheckmarkOutline,
    IoSpeedometerOutline,
    IoStarOutline,
    IoSchoolOutline
} from "react-icons/io5";
import { UserRole } from "@/interfaces/user.interface";
import type { MenuItem } from "@/interfaces/menu-item.interface";
import { ROUTES } from "./routes";

const { STUDENT, TUTOR, ADMIN } = UserRole;

/**
 * Menú de la app. Para agregar una pantalla al menú se agrega UNA línea aquí
 * indicando qué roles la ven; sidebar y barra inferior se actualizan solos.
 */
export const NAV_ITEMS: MenuItem[] = [
    // Estudiante
    { path: ROUTES.studentHome, icon: <IoHomeOutline />, title: "Inicio", subtitle: "Tu resumen y recomendados", roles: [STUDENT], exact: true },
    { path: ROUTES.tutors, icon: <IoSearchOutline />, title: "Buscar tutores", subtitle: "Por materia, universidad y tarifa", roles: [STUDENT] },
    // Estudiante y tutor
    { path: ROUTES.bookings, icon: <IoCalendarOutline />, title: "Mis tutorías", subtitle: "Reservas y sesiones", roles: [STUDENT, TUTOR] },
    // Tutor
    { path: ROUTES.tutorPanel, icon: <IoSpeedometerOutline />, title: "Panel de tutor", subtitle: "Tu actividad", roles: [TUTOR], exact: true },
    { path: ROUTES.tutorProfile, icon: <IoSchoolOutline />, title: "Mi perfil de tutor", subtitle: "Tarifa, materias y bio", roles: [TUTOR] },
    { path: ROUTES.tutorReviews, icon: <IoStarOutline />, title: "Reseñas", subtitle: "Lo que opinan de ti", roles: [TUTOR] },
    // Admin
    { path: ROUTES.adminUsers, icon: <IoPeopleOutline />, title: "Usuarios", subtitle: "Roles y estado", roles: [ADMIN] },
    { path: ROUTES.adminSubjects, icon: <IoLibraryOutline />, title: "Materias", subtitle: "Catálogo curado", roles: [ADMIN] },
    { path: ROUTES.adminTutors, icon: <IoShieldCheckmarkOutline />, title: "Tutores", subtitle: "Verificación", roles: [ADMIN] },
    // Todos
    { path: ROUTES.profile, icon: <IoPersonCircleOutline />, title: "Mi cuenta", subtitle: "Datos y sesión", roles: [STUDENT, TUTOR, ADMIN] }
];

export function navItemsFor(roles: UserRole[]) {
    return NAV_ITEMS.filter((item) => item.roles.some((r) => roles.includes(r)));
}
