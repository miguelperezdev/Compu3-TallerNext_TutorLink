import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { IoCalendarOutline, IoSearchOutline } from "react-icons/io5";
import { BookingSummaryCard } from "@/components/bookings/BookingSummaryCard";
import { TutorGrid } from "@/components/tutors/TutorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleApiError } from "@/lib/api-guard";
import { getMyBookings } from "@/lib/booking-api";
import { getUpcomingBookings } from "@/lib/booking-utils";
import { firstName } from "@/lib/format";
import { hasRole, homeForRoles } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import { UserRole } from "@/interfaces/user.interface";
import { requireSession, type Session } from "@/lib/session";
import { getSubjects } from "@/lib/subject-api";
import { getTutors } from "@/lib/tutor-api";

export const metadata: Metadata = { title: "Inicio" };

async function PopularSubjects({ token }: { token: string }) {
  let subjects;
  try {
    subjects = await getSubjects(token, { limit: 50 });
  } catch (error) {
    handleApiError(error, ROUTES.studentHome);
  }

  // El catálogo repite materias por universidad/semestre: mostramos nombres únicos.
  const names = [...new Set(subjects.map((s) => s.name))].slice(0, 8);
  if (names.length === 0) return null;

  return (
    <Section title="Materias populares">
      <ul className="flex flex-wrap gap-2">
        {names.map((name) => (
          <li key={name}>
            <Link
              href={`${ROUTES.tutors}?q=${encodeURIComponent(name)}`}
              className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

async function UpcomingBookings({ session }: { session: Session }) {
  // Lee la hora actual y datos no cacheados: render dinámico por request.
  await connection();
  let bookings;
  try {
    bookings = await getMyBookings(session.token, { limit: 50 });
  } catch (error) {
    handleApiError(error, ROUTES.studentHome);
  }

  const upcoming = getUpcomingBookings(bookings, 2);

  return (
    <Section
      title="Próximas tutorías"
      action={
        <Link href={ROUTES.bookings} className="text-sm font-semibold text-brand-700 hover:underline">
          Ver todas
        </Link>
      }
    >
      {upcoming.length === 0 ? (
        <EmptyState
          icon={<IoCalendarOutline />}
          title="No tienes tutorías agendadas"
          description="Busca un tutor y reserva tu primera sesión."
          action={<LinkButton href={ROUTES.tutors}>Buscar tutores</LinkButton>}
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {upcoming.map((b) => (
            <li key={b.id}>
              <BookingSummaryCard booking={b} viewerId={session.user.id} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

async function RecommendedTutors({ token }: { token: string }) {
  let tutors;
  try {
    tutors = await getTutors(token, { verified: true, limit: 6 });
  } catch (error) {
    handleApiError(error, ROUTES.studentHome);
  }

  return (
    <Section
      title="Tutores recomendados"
      action={
        <Link href={ROUTES.tutors} className="text-sm font-semibold text-brand-700 hover:underline">
          Ver todos
        </Link>
      }
    >
      {tutors.length === 0 ? (
        <EmptyState title="Todavía no hay tutores verificados" description="Vuelve pronto." />
      ) : (
        <TutorGrid tutors={tutors.slice(0, 3)} />
      )}
    </Section>
  );
}

function Hero({ name }: { name: string }) {
  return (
    <section className="mb-8 overflow-hidden rounded-card bg-linear-to-br from-brand-600 to-brand-800 p-6 text-white shadow-pop md:p-8">
      <p className="text-sm font-medium text-brand-100">TutorLink</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">¡Hola, {name}!</h1>
      <p className="mt-1 text-brand-100">¿Qué materia necesitas repasar hoy?</p>

      <form action={ROUTES.tutors} method="get" role="search" className="mt-5 flex max-w-xl gap-2">
        <div className="relative flex-1">
          <IoSearchOutline
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lg text-ink-muted"
          />
          <input
            type="search"
            name="q"
            aria-label="Buscar materia, tutor o universidad"
            placeholder="Buscar materia, tutor o tema..."
            className="h-12 w-full rounded-xl bg-white pr-4 pl-10 text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand-300 focus:outline-none"
          />
        </div>
        <button className="h-12 rounded-xl bg-white/15 px-5 text-sm font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/25">
          Buscar
        </button>
      </form>
    </section>
  );
}

async function StudentHome() {
  const session = await requireSession(ROUTES.studentHome);

  // /inicio es solo del estudiante; tutor y admin van a su propia pantalla.
  if (!hasRole(session.user.roles, [UserRole.STUDENT])) redirect(homeForRoles(session.user.roles));

  return (
    <>
      <Hero name={firstName(session.user.fullName)} />
      <Suspense fallback={<Skeleton className="mb-8 h-24" />}>
        <PopularSubjects token={session.token} />
      </Suspense>
      <Suspense fallback={<Skeleton className="mb-8 h-40" />}>
        <UpcomingBookings session={session} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-56" />}>
        <RecommendedTutors token={session.token} />
      </Suspense>
    </>
  );
}

export default function StudentHomePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <StudentHome />
    </Suspense>
  );
}

