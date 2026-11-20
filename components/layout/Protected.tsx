import { Suspense, type ReactNode } from "react";
import type { UserRole } from "@/interfaces/user.interface";
import { requireRole, requireSession, type Session } from "@/lib/session";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
    /** Ruta actual (para volver tras el login). */
    from: string;
    /** Roles permitidos. Si se omite basta con tener sesión. */
    roles?: UserRole[];
    fallback?: ReactNode;
    /** Contenido, o una función que recibe la sesión (token + usuario). */
    children: ReactNode | ((session: Session) => ReactNode | Promise<ReactNode>);
};

async function Gate({ from, roles, children }: Omit<Props, "fallback">) {
    const session = roles ? await requireRole(roles, from) : await requireSession(from);
    return <>{typeof children === "function" ? await children(session) : children}</>;
}

/**
 * Envuelve una página protegida:
 *  - exige sesión (y rol, si se indica) en el SERVIDOR, además del proxy;
 *  - pone el <Suspense> que exige `cacheComponents` al leer cookies.
 *
 *   export default function Page() {
 *     return (
 *       <Protected from="/panel" roles={[UserRole.TUTOR]}>
 *         {({ token, user }) => <MiContenido token={token} user={user} />}
 *       </Protected>
 *     );
 *   }
 */
export function Protected({ fallback, ...props }: Props) {
    return (
        <Suspense fallback={fallback ?? <Skeleton className="h-64" />}>
            <Gate {...props} />
        </Suspense>
    );
}
