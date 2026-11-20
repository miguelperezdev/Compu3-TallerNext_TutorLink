const copFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

/** 25000 -> "$ 25.000" */
export function formatCOP(value: number) {
    return copFormatter.format(value);
}

/** Zona horaria fija: evita diferencias servidor/cliente (hydration) en las fechas. */
const TZ = "America/Bogota";

export function formatDate(iso: string | Date) {
    return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: TZ }).format(new Date(iso));
}

export function formatDateTime(iso: string | Date) {
    const text = new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        timeZone: TZ
    }).format(new Date(iso));
    // "viernes, 20 de noviembre, 9:55 p. m." -> primera letra en mayúscula
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTimeRange(startIso: string, endIso: string) {
    const fmt = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", timeZone: TZ });
    return `${fmt.format(new Date(startIso))} – ${fmt.format(new Date(endIso))}`;
}

/** "hace 3 días" a partir de una fecha ISO. */
export function formatRelative(iso: string | Date) {
    const diffMs = new Date(iso).getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });
    const minutes = Math.round(diffMs / 60_000);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    return rtf.format(Math.round(hours / 24), "day");
}

export function getInitials(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
}

export function firstName(fullName: string) {
    return fullName.trim().split(/\s+/)[0] || "Hola";
}
