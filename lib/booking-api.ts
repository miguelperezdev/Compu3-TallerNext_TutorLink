import "server-only";
import { api, withAuth } from "./api";
import type { Booking, BookingFilters, CreateBookingInput } from "@/interfaces/booking.interface";

// Las reservas son datos personales y cambian seguido: NO se cachean.

/** Mis reservas, como estudiante o como tutor (el backend devuelve ambas caras). */
export async function getMyBookings(token: string, filters: BookingFilters = {}) {
    const { data } = await api.get<Booking[]>("/booking/mine", { ...withAuth(token), params: filters });
    return data;
}

export async function createBooking(token: string, input: CreateBookingInput) {
    const { data } = await api.post<Booking>("/booking", input, withAuth(token));
    return data;
}

type Transition = "confirm" | "cancel" | "complete";

/** confirm/complete: tutor dueño. cancel: estudiante o tutor dueño. */
export async function transitionBooking(token: string, id: string, action: Transition) {
    const { data } = await api.patch<Booking>(`/booking/${id}/${action}`, undefined, withAuth(token));
    return data;
}
