import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNav, MobileTopbar } from "@/components/layout/MobileChrome";

/**
 * Shell de la zona autenticada: sidebar (desktop) o topbar + tab bar (móvil).
 * Es síncrono a propósito: todo lo que lee cookies vive dentro de <Suspense>
 * en los componentes hijos, así el shell se pre-renderiza y se ve al instante.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 lg:px-10 lg:pt-10 lg:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
