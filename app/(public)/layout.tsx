import Link from "next/link";
import { Brand } from "@/components/Brand";
import { LinkButton } from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";

/** Layout de la zona pública: barra superior con CTA + pie de página. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href={ROUTES.home} className="text-xl">
            <Brand />
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-6 text-sm font-semibold text-ink-soft md:flex">
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#beneficios" className="hover:text-ink">Beneficios</a>
            <a href="#tutores" className="hover:text-ink">Ser tutor</a>
          </nav>
          <div className="flex items-center gap-2">
            <LinkButton href={ROUTES.login} variant="ghost" size="sm">
              Ingresar
            </LinkButton>
            <LinkButton href={ROUTES.register} size="sm">
              Crear cuenta
            </LinkButton>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-ink-muted sm:flex-row">
          <Brand className="text-base" />
          <p>Computación en Internet 3 · 2026-2 · Proyecto TutorLink</p>
        </div>
      </footer>
    </div>
  );
}
