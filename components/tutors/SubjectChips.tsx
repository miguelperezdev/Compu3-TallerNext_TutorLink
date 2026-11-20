import { Badge } from "@/components/ui/Badge";
import type { Subject } from "@/interfaces/subject.interface";

/** Chips de materias con tope ("+2"). */
export function SubjectChips({ subjects, max = 3 }: { subjects: Subject[]; max?: number }) {
    const visible = subjects.slice(0, max);
    const hidden = subjects.length - visible.length;

    return (
        <ul className="flex flex-wrap gap-1.5">
            {visible.map((s) => (
                <li key={s.id}>
                    <Badge tone="brand">{s.name}</Badge>
                </li>
            ))}
            {hidden > 0 && (
                <li>
                    <Badge>+{hidden}</Badge>
                </li>
            )}
        </ul>
    );
}
