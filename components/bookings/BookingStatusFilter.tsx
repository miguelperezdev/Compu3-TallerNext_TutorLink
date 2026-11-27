import Link from "next/link";
import { BookingStatus } from "@/interfaces/booking.interface";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

const FILTERS: { label: string; status?: BookingStatus }[] = [
    { label: "Todas" },
    { label: "Pendientes", status: BookingStatus.PENDING },
    { label: "Confirmadas", status: BookingStatus.CONFIRMED },
    { label: "Completadas", status: BookingStatus.COMPLETED },
    { label: "Canceladas", status: BookingStatus.CANCELLED }
];

/** Chips de filtro por estado. El filtro vive en la URL (`?status=`), así el enlace se puede compartir. */
export function BookingStatusFilter({ current }: { current?: BookingStatus }) {
    return (
        <nav aria-label="Filtrar por estado" className="mb-6">
            <ul className="flex flex-wrap gap-2">
                {FILTERS.map(({ label, status }) => {
                    const active = status === current;
                    return (
                        <li key={label}>
                            <Link
                                href={status ? `${ROUTES.bookings}?status=${status}` : ROUTES.bookings}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "inline-block rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                                    active
                                        ? "border-brand-600 bg-brand-600 text-white"
                                        : "border-line bg-surface text-ink-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                                )}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
