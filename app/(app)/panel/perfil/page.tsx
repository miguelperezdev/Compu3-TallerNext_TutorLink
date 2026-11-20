import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Mi perfil de tutor" };

export default function Page() {
  return (
    <Protected from="/panel/perfil" roles={[UserRole.TUTOR]}>
      <ComingSoon
        title="Mi perfil de tutor"
        description="Crea o actualiza tu perfil público."
        todo={[
          "Formulario PUT /tutor/me (bio, tarifa, universidad, materias)",
          "Selector múltiple de materias desde GET /subject",
          "Estado de verificación visible",
        ]}
      />
    </Protected>
  );
}
