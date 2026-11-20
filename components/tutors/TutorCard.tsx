import Link from "next/link";
import { Suspense } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TutorProfile } from "@/interfaces/tutor.interface";
import { formatCOP } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { SubjectChips } from "./SubjectChips";
import { TutorRating } from "./TutorRating";
import { VerifiedBadge } from "./VerifiedBadge";

/** Tarjeta de tutor del marketplace (Server Component; sin estado). */
export function TutorCard({ tutor }: { tutor: TutorProfile }) {
    return (
        <article className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop">
            <div className="flex items-start gap-3">
                <Avatar name={tutor.user.fullName} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold">
                            <Link href={ROUTES.tutor(tutor.id)} className="hover:text-brand-700">
                                {tutor.user.fullName}
                            </Link>
                        </h3>
                        {tutor.isVerified && <VerifiedBadge />}
                    </div>
                    <p className="truncate text-sm text-ink-soft">{tutor.university}</p>
                </div>
            </div>

            <SubjectChips subjects={tutor.subjects} />

            <div className="mt-auto flex items-end justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                    <Suspense fallback={<Skeleton className="h-5 w-20" />}>
                        <TutorRating tutorId={tutor.id} />
                    </Suspense>
                    <p className="text-lg font-extrabold">
                        {formatCOP(tutor.hourlyRate)}
                        <span className="text-xs font-medium text-ink-muted"> / h</span>
                    </p>
                </div>
                <LinkButton href={ROUTES.tutor(tutor.id)} size="sm">
                    Ver perfil
                </LinkButton>
            </div>
        </article>
    );
}

export function TutorGrid({ tutors }: { tutors: TutorProfile[] }) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tutors.map((tutor) => (
                <li key={tutor.id} className="flex">
                    <div className="flex-1">
                        <TutorCard tutor={tutor} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
