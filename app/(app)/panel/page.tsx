import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Panel de tutor" };

export default function Page() {
  return (
    <Protected from="/panel" roles={[UserRole.TUTOR]}>
      <ComingSoon
        title="Panel de tutor"
        description="Resumen de tu actividad como tutor."
        todo={[
          "Tarjetas: sesiones, promedio de reseñas",
          "Próximas tutorías y últimas reseñas",
          "Aviso si el perfil de tutor aún no existe",
        ]}
      />
    </Protected>
  );
}
