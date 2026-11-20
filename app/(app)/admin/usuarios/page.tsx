import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Usuarios" };

export default function Page() {
  return (
    <Protected from="/admin/usuarios" roles={[UserRole.ADMIN]}>
      <ComingSoon
        title="Usuarios"
        description="Administra roles y estado de las cuentas."
        todo={[
          "Tabla paginada de GET /user",
          "Cambiar roles (PATCH /user/:id/roles) y desactivar (DELETE)",
          "No permitir quitarse el propio rol admin",
        ]}
      />
    </Protected>
  );
}
