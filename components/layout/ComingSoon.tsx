import { IoConstructOutline } from "react-icons/io5";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
    title: string;
    description: string;
    /** Lo que debe tener la pantalla al terminar. */
    todo: string[];
};

/** Marcador de pantalla pendiente. Se reemplaza por la implementación real. */
export function ComingSoon({ title, description, todo }: Props) {
    return (
        <>
            <PageHeader title={title} description={description} />
            <Card className="border-dashed">
                <div className="flex items-start gap-4">
                    <IoConstructOutline className="mt-1 shrink-0 text-3xl text-brand-400" aria-hidden />
                    <div>
                        <p className="font-bold">Pantalla pendiente de implementar</p>
                        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                            {todo.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
        </>
    );
}
