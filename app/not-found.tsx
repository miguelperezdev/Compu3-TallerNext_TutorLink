import Link from "next/link";
import { Brand } from "@/components/Brand";
import { LinkButton } from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <Link href={ROUTES.home} className="text-xl">
          <Brand />
        </Link>
        <p className="mt-10 text-7xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-bold">No encontramos esa página</h1>
        <p className="mt-1 text-ink-soft">Puede que el enlace esté roto o que el contenido ya no exista.</p>
        <LinkButton href={ROUTES.home} className="mt-6">
          Volver al inicio
        </LinkButton>
      </div>
    </main>
  );
}
