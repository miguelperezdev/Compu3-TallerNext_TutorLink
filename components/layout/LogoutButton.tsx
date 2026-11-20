import { IoLogOutOutline } from "react-icons/io5";
import { logoutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/cn";

/** <form> + Server Action: funciona incluso sin JavaScript. */
export function LogoutButton({ className, label = "Cerrar sesión" }: { className?: string; label?: string }) {
    return (
        <form action={logoutAction}>
            <button
                className={cn(
                    "inline-flex items-center gap-2 text-sm font-semibold transition-colors",
                    className
                )}
            >
                <IoLogOutOutline className="text-lg" aria-hidden />
                {label}
            </button>
        </form>
    );
}
