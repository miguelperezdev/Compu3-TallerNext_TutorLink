import { IoCheckmarkCircle } from "react-icons/io5";
import { Badge } from "@/components/ui/Badge";

export function VerifiedBadge() {
    return (
        <Badge tone="success">
            <IoCheckmarkCircle aria-hidden /> Verificado
        </Badge>
    );
}
