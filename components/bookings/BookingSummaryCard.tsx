import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { Avatar } from "@/components/ui/Avatar";
import type { Booking } from "@/interfaces/booking.interface";
import { formatDateTime, formatTimeRange } from "@/lib/format";
import { BookingStatusBadge } from "./BookingStatusBadge";

/**
 * Tarjeta compacta de una reserva. Muestra a "la otra parte":
 * si quien mira es el estudiante ve al tutor, y viceversa.
 * Las acciones (confirmar, cancelar, reseñar) se pasan en `actions`.
 */
export function BookingSummaryCard({
    booking,
    viewerId,
    actions
}: {
    booking: Booking;
    viewerId: string;
    actions?: React.ReactNode;
}) {
    const other = booking.student.id === viewerId ? booking.tutorProfile.user : booking.student;

    return (
        <article className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
            <header className="flex items-center gap-3">
                <Avatar name={other.fullName} />
                <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{other.fullName}</p>
                    <p className="truncate text-sm text-ink-soft">{booking.subject.name}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
            </header>
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                <div className="flex items-center gap-1.5">
                    <IoCalendarOutline aria-hidden />
                    <dt className="sr-only">Fecha</dt>
                    <dd>{formatDateTime(booking.startAt)}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                    <IoTimeOutline aria-hidden />
                    <dt className="sr-only">Horario</dt>
                    <dd>{formatTimeRange(booking.startAt, booking.endAt)}</dd>
                </div>
            </dl>
            {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
        </article>
    );
}
