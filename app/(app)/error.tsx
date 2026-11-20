"use client";
import { IoWarningOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Error boundary de la zona autenticada: si la API falla (caída, 500, timeout)
 * se muestra esto dentro del shell, sin tumbar sidebar ni navegación.
 * (No muestra el mensaje real del error: en producción Next lo oculta a propósito.)
 */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={<IoWarningOutline />}
      title="Algo salió mal"
      description="No pudimos cargar esta pantalla. Si el servidor estaba dormido, inténtalo de nuevo en unos segundos."
      action={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
