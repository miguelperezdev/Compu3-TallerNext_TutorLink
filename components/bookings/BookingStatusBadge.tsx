import { Badge } from "@/components/ui/Badge";
import { BookingStatus } from "@/interfaces/booking.interface";

const config: Record<BookingStatus, { label: string; tone: "warning" | "brand" | "success" | "danger" }> = {
    [BookingStatus.PENDING]: { label: "Pendiente", tone: "warning" },
    [BookingStatus.CONFIRMED]: { label: "Confirmada", tone: "brand" },
    [BookingStatus.COMPLETED]: { label: "Completada", tone: "success" },
    [BookingStatus.CANCELLED]: { label: "Cancelada", tone: "danger" }
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
    const { label, tone } = config[status];
    return <Badge tone={tone}>{label}</Badge>;
}
