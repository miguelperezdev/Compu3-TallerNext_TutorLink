import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { Protected } from "@/components/layout/Protected";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRole } from "@/interfaces/user.interface";
import { isApiError } from "@/lib/api";
import { handleApiError } from "@/lib/api-guard";
import { formatCOP } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import type { Session } from "@/lib/session";
import { getTutor } from "@/lib/tutor-api";

export const metadata: Metadata = { title: "Reservar tutoría" };

async function BookingContent({ session, params }: { session: Session } & Pick<PageProps<"/reservar/[tutorId]">, "params">) {
  const { tutorId } = await params;

  let tutor;
  try {
    tutor = await getTutor(session.token, tutorId);
  } catch (error) {
    // 400 = el id no es un UUID; 404 = no existe. Para el usuario es lo mismo.
    if (isApiError(error) && (error.status === 404 || error.status === 400)) notFound();
    handleApiError(error, ROUTES.book(tutorId));
  }

  return (
    <>
      <Link
        href={ROUTES.tutor(tutor.id)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
      >
        <IoChevronBack aria-hidden /> Volver al perfil
      </Link>

      <PageHeader eyebrow="Paso 2 de 3 · Elegir horario" title="Reservar tutoría" />

      <Card className="flex items-center gap-4">
        <Avatar name={tutor.user.fullName} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{tutor.user.fullName}</p>
          <p className="text-sm text-ink-soft">{tutor.university}</p>
          <p className="text-sm font-semibold text-brand-700">{formatCOP(tutor.hourlyRate)} COP / h</p>
        </div>
      </Card>
    </>
  );
}

export default function BookTutorPage({ params }: PageProps<"/reservar/[tutorId]">) {
  return (
    <Protected from={ROUTES.tutors} roles={[UserRole.STUDENT]} fallback={<Skeleton className="h-96" />}>
      {(session) => <BookingContent session={session} params={params} />}
    </Protected>
  );
}
