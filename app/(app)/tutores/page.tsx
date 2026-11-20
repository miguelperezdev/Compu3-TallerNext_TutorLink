import type { Metadata } from "next";
import { IoSearchOutline } from "react-icons/io5";
import { Protected } from "@/components/layout/Protected";
import { Paginator } from "@/components/ui/Paginator";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { TutorFilters } from "@/components/tutors/TutorFilters";
import { TutorGrid } from "@/components/tutors/TutorCard";
import { UserRole } from "@/interfaces/user.interface";
import { handleApiError } from "@/lib/api-guard";
import { paginate } from "@/lib/pagination";
import { ROUTES } from "@/lib/routes";
import type { Session } from "@/lib/session";
import { getSubjects } from "@/lib/subject-api";
import { getTutors } from "@/lib/tutor-api";
import {
  TUTORS_PAGE_SIZE,
  filterTutorsByText,
  parseTutorSearchParams,
  sortTutors,
  toApiFilters,
  toQuery,
} from "@/lib/tutor-search";

export const metadata: Metadata = { title: "Buscar tutores" };

async function TutorResults({
  session,
  searchParams,
}: { session: Session } & Pick<PageProps<"/tutores">, "searchParams">) {
  const params = parseTutorSearchParams(await searchParams);

  // Filtros "duros" (materia, universidad, tarifa, verificado) los resuelve la API;
  // el texto libre, el orden y la paginación se hacen en memoria (como en el curso).
  let tutors, subjects;
  try {
    [tutors, subjects] = await Promise.all([
      getTutors(session.token, toApiFilters(params)),
      getSubjects(session.token, { limit: 200 }),
    ]);
  } catch (error) {
    handleApiError(error, ROUTES.tutors);
  }

  const refined = sortTutors(filterTutorsByText(tutors, params.q), params.sort);
  const { items, current, totalPages, total } = paginate(refined, params.page, TUTORS_PAGE_SIZE);
  // Query sin `page` para que cada link del paginador conserve los filtros.
  const query = Object.fromEntries(new URLSearchParams(toQuery({ ...params, page: undefined })));

  return (
    <>
      <TutorFilters subjects={subjects} values={params} />

      {items.length === 0 ? (
        <EmptyState
          icon={<IoSearchOutline />}
          title="No encontramos tutores con esos filtros"
          description="Prueba con otra materia, sube la tarifa máxima o quita el filtro de verificados."
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-soft" aria-live="polite">
            {total} {total === 1 ? "tutor encontrado" : "tutores encontrados"}
          </p>
          <TutorGrid tutors={items} />
          <footer className="mt-6 flex justify-center">
            <Paginator
              basePath={ROUTES.tutors}
              page={current}
              totalPages={totalPages}
              params={query}
            />
          </footer>
        </>
      )}
    </>
  );
}

export default function TutorsPage({ searchParams }: PageProps<"/tutores">) {
  return (
    <>
      <PageHeader
        eyebrow="Paso 1 de 3 · Buscar tutor"
        title="Encuentra tu tutor"
        description="Filtra por materia, universidad y tarifa. Los tutores verificados fueron revisados por un administrador."
      />
      <Protected from={ROUTES.tutors} roles={[UserRole.STUDENT]} fallback={<Skeleton className="h-96" />}>
        {(session) => <TutorResults session={session} searchParams={searchParams} />}
      </Protected>
    </>
  );
}
