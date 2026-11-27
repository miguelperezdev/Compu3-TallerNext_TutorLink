"use client";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn } from "@/lib/cn";

const OPTIONS = [1, 2, 3, 4, 5];

/**
 * Selector de 1 a 5 estrellas accesible: son radios nativos (flechas del teclado, foco visible,
 * lector de pantalla) agrupados en un fieldset; la estrella es solo el aspecto visual.
 */
export function StarRatingInput({
    name,
    value,
    onChange,
    error
}: {
    name: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
}) {
    return (
        <fieldset aria-describedby={error ? `${name}-error` : undefined}>
            <legend className="mb-1.5 text-sm font-semibold text-ink">Tu calificación</legend>
            <div className="flex gap-1">
                {OPTIONS.map((n) => (
                    <label key={n} className="cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={n}
                            // `defaultChecked` (no `checked`): al terminar una Server Action React hace `form.reset()`,
                            // que vuelve al valor por defecto; así la calificación elegida sobrevive a un error del servidor.
                            defaultChecked={value === n}
                            onChange={() => onChange(n)}
                            className="peer sr-only"
                        />
                        <span className="sr-only">{n === 1 ? "1 estrella" : `${n} estrellas`}</span>
                        <span
                            aria-hidden
                            className={cn(
                                "block rounded-md p-0.5 text-4xl text-warning-500 transition-transform hover:scale-110",
                                "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500"
                            )}
                        >
                            {n <= value ? <IoStar /> : <IoStarOutline />}
                        </span>
                    </label>
                ))}
            </div>
            {error && (
                <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger-600">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
