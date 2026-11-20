import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Mis tutorías" };

export default function Page() {
  return (
    <Protected from="/mis-tutorias" roles={[UserRole.STUDENT, UserRole.TUTOR]}>
      <ComingSoon
        title="Mis tutorías"
        description="Tus reservas como estudiante o como tutor."
        todo={[
          "Listar GET /booking/mine con filtro por estado y paginación",
          "Acciones por rol: confirmar y completar (tutor), cancelar (ambos)",
          "Botón Calificar en reservas COMPLETED (estudiante)",
        ]}
      />
    </Protected>
  );
}
