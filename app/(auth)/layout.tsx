import Link from "next/link";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Brand } from "@/components/Brand";
import { ROUTES } from "@/lib/routes";

const highlights = [
  "Tutores universitarios verificados",
  "Reservas sin choques de horario",
  "Reseñas solo de clases realmente dictadas",
];

/** Layout de /login y /register: panel de marca a la izquierda (desktop) y formulario. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white lg:flex">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-brand-500/20 blur-3xl" />
        <Link href={ROUTES.home} className="relative text-xl">
          <Brand tone="light" />
        </Link>
        <div className="relative">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">
            Tu red de apoyo académico, a un clic.
          </h2>
          <ul className="mt-8 space-y-3 text-brand-100">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <IoCheckmarkCircle className="shrink-0 text-xl text-brand-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-200/70">Computación en Internet 3 · 2026-2</p>
      </aside>

      <main className="flex flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Link href={ROUTES.home} className="mb-8 inline-block text-xl lg:hidden">
            <Brand />
          </Link>
          <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
