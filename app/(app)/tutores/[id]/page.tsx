import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { IoChevronBack, IoChatbubblesOutline } from "react-icons/io5";
import { Protected } from "@/components/layout/Protected";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { SubjectChips } from "@/components/tutors/SubjectChips";
import { VerifiedBadge } from "@/components/tutors/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRole } from "@/interfaces/user.interface";
import { isApiError } from "@/lib/api";
import { handleApiError } from "@/lib/api-guard";
import { formatCOP } from "@/lib/format";
import { getTutorReviews } from "@/lib/review-api";
import { ROUTES } from "@/lib/routes";
import type { Session } from "@/lib/session";
import { getTutor } from "@/lib/tutor-api";

export const metadata: Metadata = { title: "Perfil de tutor" };

async function Reviews({ token, tutorId }: { token: string; tutorId: string }) {
  // formatRelative usa la hora actual: se marca el render como dinámico (por request).
  await connection();
  let data;
  try {
    data = await getTutorReviews(token, tutorId);
  } catch (error) {
    handleApiError(error, ROUTES.tutor(tutorId));
  }

  if (data.count === 0) {
    return (
      <EmptyState
        icon={<IoChatbubblesOutline />}
        title="Aún no tiene reseñas"
        description="Las reseñas solo las pueden dejar estudiantes que completaron una sesión con este tutor."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ReviewSummary average={data.average} count={data.count} reviews={data.reviews} />
      <ul className="space-y-3">
        {data.reviews.map((review) => (
          <li key={review.id}>
            <ReviewItem review={review} />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function TutorProfile({ session, params }: { session: Session } & Pick<PageProps<"/tutores/[id]">, "params">) {
  const { id } = await params;

  let tutor;
  try {
    tutor = await getTutor(session.token, id);
  } catch (error) {
    // 400 = el id no es un UUID; 404 = no existe. Para el usuario es lo mismo.
    if (isApiError(error) && (error.status === 404 || error.status === 400)) notFound();
    handleApiError(error, ROUTES.tutor(id));
  }

  return (
    <>
      <Link
        href={ROUTES.tutors}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
      >
        <IoChevronBack aria-hidden /> Volver a resultados
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={tutor.user.fullName} size="xl" />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{tutor.user.fullName}</h1>
                {tutor.isVerified && <VerifiedBadge />}
              </div>
              <p className="text-ink-soft">{tutor.university}</p>
              <SubjectChips subjects={tutor.subjects} max={10} />
            </div>
          </Card>

          <Section title="Sobre mí">
            <Card>
              <p className="whitespace-pre-line text-ink-soft">“{tutor.bio}”</p>
            </Card>
          </Section>

          <Section title="Trayectoria académica">
            <Card>
              <p className="whitespace-pre-line text-ink-soft">{tutor.academicHistory}</p>
            </Card>
          </Section>

          <Section title="Reseñas">
            <Suspense fallback={<Skeleton className="h-40" />}>
              <Reviews token={session.token} tutorId={tutor.id} />
            </Suspense>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <Card className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Tarifa por hora</p>
              <p className="text-4xl font-extrabold">
                {formatCOP(tutor.hourlyRate)} <span className="text-base font-medium text-ink-muted">COP / h</span>
              </p>
            </div>
            <ul className="space-y-1.5 text-sm text-ink-soft">
              <li>• Pagas solo por el tiempo reservado.</li>
              <li>• El tutor debe confirmar tu reserva.</li>
              <li>• Puedes cancelar mientras esté pendiente o confirmada.</li>
            </ul>
            <LinkButton href={ROUTES.book(tutor.id)} size="lg" fullWidth>
              Reservar tutoría
            </LinkButton>
          </Card>
        </aside>
      </div>
    </>
  );
}

export default function TutorProfilePage({ params }: PageProps<"/tutores/[id]">) {
  return (
    <Protected from={ROUTES.tutors} roles={[UserRole.STUDENT]} fallback={<Skeleton className="h-96" />}>
      {(session) => <TutorProfile session={session} params={params} />}
    </Protected>
  );
}
