import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Calificar tutoría" };

export default function Page() {
  return (
    <Protected from="/resenas/nueva" roles={[UserRole.STUDENT]}>
      <ComingSoon
        title="Calificar tutoría"
        description="Deja tu reseña de una sesión completada."
        todo={[
          "Formulario de 1 a 5 estrellas y comentario (3 a 500 caracteres)",
          "POST /review y updateTag de reviews-<tutorId>",
          "Pantalla de gracias por tu reseña",
        ]}
      />
    </Protected>
  );
}
