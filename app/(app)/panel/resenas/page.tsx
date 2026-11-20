import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Reseñas recibidas" };

export default function Page() {
  return (
    <Protected from="/panel/resenas" roles={[UserRole.TUTOR]}>
      <ComingSoon
        title="Reseñas recibidas"
        description="Lo que opinan los estudiantes de tus tutorías."
        todo={[
          "Reusar ReviewSummary y ReviewItem",
          "Cargar el tutorProfile propio para obtener su id",
        ]}
      />
    </Protected>
  );
}
