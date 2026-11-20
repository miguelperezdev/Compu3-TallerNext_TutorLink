import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Materias" };

export default function Page() {
  return (
    <Protected from="/admin/materias" roles={[UserRole.ADMIN]}>
      <ComingSoon
        title="Materias"
        description="Catálogo curado de materias."
        todo={[
          "Listado con filtros y paginación",
          "Crear, editar y eliminar materias; manejar 409 de duplicados",
          "updateTag subjects tras cada cambio",
        ]}
      />
    </Protected>
  );
}
