import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { IoAlertCircleOutline, IoChevronBack } from "react-icons/io5";
import { BookingSummaryCard } from "@/components/bookings/BookingSummaryCard";
import { Protected } from "@/components/layout/Protected";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { BookingStatus } from "@/interfaces/booking.interface";
import { UserRole } from "@/interfaces/user.interface";
import { handleApiError } from "@/lib/api-guard";
import { getMyBookings } from "@/lib/booking-api";
import { readParam } from "@/lib/pagination";
import { ROUTES } from "@/lib/routes";
import type { Session } from "@/lib/session";

export const metadata: Metadata = { title: "Calificar tutoría" };

function NotReviewable({ description }: { description: string }) {
  return (
    <EmptyState
      icon={<IoAlertCircleOutline />}
      title="No puedes calificar esta tutoría"
      description={description}
      action={<LinkButton href={ROUTES.bookings}>Volver a mis tutorías</LinkButton>}
    />
  );
}

async function NewReview({ session, searchParams }: { session: Session } & Pick<PageProps<"/resenas/nueva">, "searchParams">) {
  // Reservas = datos personales sin caché: render dinámico por request.
  await connection();
  const params = await searchParams;
  const bookingId = readParam(params.booking);

  if (!bookingId) {
    return <NotReviewable description="Abre esta pantalla desde el botón Calificar de una tutoría completada." />;
  }

  // No existe GET /booking/:id: la reserva se busca entre las completadas del usuario.
  let completed;
  try {
    completed = await getMyBookings(session.token, { status: BookingStatus.COMPLETED, limit: 100 });
  } catch (error) {
    handleApiError(error, ROUTES.newReview(bookingId));
  }

  const booking = completed.find((b) => b.id === bookingId && b.student.id === session.user.id);
  if (!booking) {
    return (
      <NotReviewable description="La reserva no existe, no es tuya o todavía no está completada. Solo se califican tutorías completadas." />
    );
  }

  return (
    <>
      <Link
        href={ROUTES.bookings}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
      >
        <IoChevronBack aria-hidden /> Volver a mis tutorías
      </Link>
      <PageHeader title="Calificar tutoría" description="Tu opinión ayuda a otros estudiantes a elegir tutor." />
      <BookingSummaryCard booking={booking} viewerId={session.user.id} />
      <ReviewForm bookingId={booking.id} tutorName={booking.tutorProfile.user.fullName} />
    </>
  );
}

export default function NewReviewPage({ searchParams }: PageProps<"/resenas/nueva">) {
  return (
    <Protected from={ROUTES.bookings} roles={[UserRole.STUDENT]} fallback={<Skeleton className="h-96" />}>
      {(session) => <NewReview session={session} searchParams={searchParams} />}
    </Protected>
  );
}
