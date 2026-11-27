"use client";
import { useActionState, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { createReviewAction, type ReviewFormState } from "@/app/(app)/resenas/nueva/actions";
import { Textarea } from "@/components/form-ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { REVIEW_COMMENT_MAX, REVIEW_COMMENT_MIN } from "@/lib/review-utils";
import { ROUTES } from "@/lib/routes";
import { StarRatingInput } from "./StarRatingInput";

const initialState: ReviewFormState = {};

export function ReviewForm({ bookingId, tutorName }: { bookingId: string; tutorName: string }) {
    const [state, formAction] = useActionState(createReviewAction, initialState);
    // Estado controlado: lo escrito se conserva si el servidor responde con un error.
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    if (state.done) {
        return (
            <>
                <PageHeader title="¡Gracias por tu reseña!" />
                <Card className="space-y-4">
                    <div className="flex items-center gap-3 text-success-700">
                        <IoCheckmarkCircle className="size-8 shrink-0" aria-hidden />
                        <p className="font-bold">Tu opinión sobre {tutorName} ya quedó publicada.</p>
                    </div>
                    <p className="text-sm text-ink-soft">Ayudas a que otros estudiantes elijan mejor a su tutor.</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <LinkButton href={ROUTES.bookings} size="lg">
                            Volver a mis tutorías
                        </LinkButton>
                        <LinkButton href={ROUTES.studentHome} variant="secondary" size="lg">
                            Ir al inicio
                        </LinkButton>
                    </div>
                </Card>
            </>
        );
    }

    const e = state.errors ?? {};

    return (
        <form action={formAction} noValidate className="mt-6 space-y-4">
            <input type="hidden" name="bookingId" value={bookingId} />

            {state.error && <Alert tone="danger">{state.error}</Alert>}

            <Card className="space-y-5">
                <StarRatingInput name="rating" value={rating} onChange={setRating} error={e.rating} />
                <Textarea
                    label="Comentario"
                    name="comment"
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={REVIEW_COMMENT_MAX}
                    placeholder={`Cuéntanos cómo te fue con ${tutorName}`}
                    hint={`${comment.trim().length}/${REVIEW_COMMENT_MAX} caracteres (mínimo ${REVIEW_COMMENT_MIN}).`}
                    error={e.comment}
                    required
                />
            </Card>

            <div className="flex justify-end">
                <SubmitButton size="lg" pendingText="Enviando reseña...">
                    Enviar reseña
                </SubmitButton>
            </div>
        </form>
    );
}
