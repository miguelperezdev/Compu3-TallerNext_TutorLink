import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Verificación de tutores" };

export default function Page() {
  return (
    <Protected from="/admin/tutores" roles={[UserRole.ADMIN]}>
      <ComingSoon
        title="Verificación de tutores"
        description="Revisa y verifica perfiles de tutor."
        todo={[
          "Listar tutores (verified=false primero)",
          "Botón verificar (PATCH /tutor/:id/verify) y updateTag tutors",
        ]}
      />
    </Protected>
  );
}
