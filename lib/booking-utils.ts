import { BookingStatus, type Booking } from "@/interfaces/booking.interface";

/** Reservas activas (pendientes o confirmadas) que aún no terminan, en orden de inicio. */
export function getUpcomingBookings(bookings: Booking[], limit = 2, now = Date.now()) {
    return bookings
        .filter(
            (b) =>
                (b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) &&
                new Date(b.endAt).getTime() > now
        )
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
        .slice(0, limit);
}
