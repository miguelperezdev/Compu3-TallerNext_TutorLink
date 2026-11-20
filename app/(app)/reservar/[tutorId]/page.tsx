import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Protected } from "@/components/layout/Protected";
import { UserRole } from "@/interfaces/user.interface";

export const metadata: Metadata = { title: "Reservar tutoría" };

export default function Page() {
  return (
    <Protected from="/reservar" roles={[UserRole.STUDENT]}>
      <ComingSoon
        title="Reservar tutoría"
        description="Elige materia, fecha y hora."
        todo={[
          "Paso 2: elegir materia y horario (startAt / endAt)",
          "Paso 3: resumen y confirmar con POST /booking",
          "Pantalla de reserva confirmada",
        ]}
      />
    </Protected>
  );
}
