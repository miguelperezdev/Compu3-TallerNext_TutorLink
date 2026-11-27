import type { Metadata } from "next";
import { connection } from "next/server";
import { IoCalendarOutline } from "react-icons/io5";
import { BookingStatusFilter } from "@/components/bookings/BookingStatusFilter";
import { BookingSummaryCard } from "@/components/bookings/BookingSummaryCard";
import { Protected } from "@/components/layout/Protected";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Paginator } from "@/components/ui/Paginator";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRole } from "@/interfaces/user.interface";
import { handleApiError } from "@/lib/api-guard";
import { getMyBookings } from "@/lib/booking-api";
import { BOOKINGS_PAGE_SIZE, parseBookingStatus } from "@/lib/booking-utils";
import { readParam, readPositiveInt } from "@/lib/pagination";
import { hasRole } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import type { Session } from "@/lib/session";

export const metadata: Metadata = { title: "Mis tutorías" };

async function MyBookings({ session, searchParams }: { session: Session } & Pick<PageProps<"/mis-tutorias">, "searchParams">) {
  // Reservas = datos personales sin caché: render dinámico por request.
  await connection();
  const params = await searchParams;
  const status = parseBookingStatus(readParam(params.status));
  const page = readPositiveInt(params.page, 1);

  // El backend no devuelve el total: se pide una reserva de más para saber si hay página siguiente.
  let fetched;
  try {
    fetched = await getMyBookings(session.token, {
      status,
      limit: BOOKINGS_PAGE_SIZE + 1,
      skip: (page - 1) * BOOKINGS_PAGE_SIZE
    });
  } catch (error) {
    handleApiError(error, ROUTES.bookings);
  }
  const hasNext = fetched.length > BOOKINGS_PAGE_SIZE;
  const bookings = fetched.slice(0, BOOKINGS_PAGE_SIZE);

  const isStudent = hasRole(session.user.roles, [UserRole.STUDENT]);

  return (
    <>
      <PageHeader
        title="Mis tutorías"
        description={
          isStudent ? "Tus reservas como estudiante y, si eres tutor, las que recibes." : "Las reservas que recibes como tutor."
        }
      />
      <BookingStatusFilter current={status} />

      {bookings.length === 0 ? (
        <EmptyState
          icon={<IoCalendarOutline />}
          title={status ? "No hay reservas con este estado" : "Aún no tienes tutorías"}
          description={
            status
              ? "Prueba con otro filtro para ver el resto de tus reservas."
              : "Cuando reserves o recibas una tutoría, aparecerá aquí."
          }
          action={
            isStudent && !status ? <LinkButton href={ROUTES.tutors}>Buscar tutores</LinkButton> : undefined
          }
        />
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <BookingSummaryCard booking={booking} viewerId={session.user.id} />
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Paginator
              basePath={ROUTES.bookings}
              page={page}
              totalPages={hasNext ? page + 1 : page}
              params={status ? { status } : {}}
            />
          </div>
        </>
      )}
    </>
  );
}

export default function MyBookingsPage({ searchParams }: PageProps<"/mis-tutorias">) {
  return (
    <Protected
      from={ROUTES.bookings}
      roles={[UserRole.STUDENT, UserRole.TUTOR]}
      fallback={<Skeleton className="h-96" />}
    >
      {(session) => <MyBookings session={session} searchParams={searchParams} />}
    </Protected>
  );
}
