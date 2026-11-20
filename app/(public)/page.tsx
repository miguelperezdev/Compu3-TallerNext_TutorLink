import { IoCheckmarkCircle } from "react-icons/io5";
import { LinkButton } from "@/components/ui/Button";
import { benefits, howItWorks, popularSubjects } from "@/data/landing";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-32 right-0 size-[32rem] rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
              Tutorías universitarias entre pares
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Aprueba esa materia con el tutor <span className="text-brand-300">correcto</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-100">
              Encuentra tutores de tu universidad, reserva una sesión en minutos y deja tu reseña cuando termine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={ROUTES.register} size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
                Empezar gratis
              </LinkButton>
              <LinkButton
                href={ROUTES.login}
                size="lg"
                variant="ghost"
                className="text-white ring-1 ring-white/30 hover:bg-white/10"
              >
                Ya tengo cuenta
              </LinkButton>
            </div>
          </div>

          {/* Tarjeta de muestra, inspirada en el prototipo */}
          <div aria-hidden className="mx-auto w-full max-w-sm rotate-2 rounded-card bg-surface p-5 text-ink shadow-pop">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">Tutor recomendado</p>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">LM</span>
              <div>
                <p className="font-bold">Laura Méndez</p>
                <p className="text-sm text-ink-soft">Universidad del Valle</p>
              </div>
              <span className="ml-auto rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">Verificado</span>
            </div>
            <div className="mt-4 flex gap-1.5">
              {popularSubjects.slice(0, 2).map((s) => (
                <span key={s} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">{s}</span>
              ))}
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-2xl font-extrabold">$25.000<span className="text-xs font-medium text-ink-muted"> / h</span></p>
              <span className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Ver perfil</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">Cómo funciona</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">Del primer clic a la reseña, en cuatro pasos.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="rounded-card border border-line bg-surface p-6 shadow-card">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-600 font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Pensado para estudiantes y tutores</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {benefits.map((b) => (
              <li key={b.title} className="flex gap-3">
                <IoCheckmarkCircle className="mt-0.5 shrink-0 text-2xl text-success-600" aria-hidden />
                <div>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="text-sm text-ink-soft">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA tutor */}
      <section id="tutores" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <div className="rounded-card bg-linear-to-br from-brand-600 to-brand-800 p-8 text-white shadow-pop md:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight">¿Dominas una materia? Compártela.</h2>
          <p className="mt-2 max-w-2xl text-brand-100">
            Crea tu cuenta, solicita el rol de tutor a un administrador y arma tu perfil con tu tarifa y tus materias.
          </p>
          <LinkButton href={ROUTES.register} size="lg" className="mt-6 bg-white text-brand-800 hover:bg-brand-50">
            Crear mi cuenta
          </LinkButton>
        </div>
      </section>
    </>
  );
}
