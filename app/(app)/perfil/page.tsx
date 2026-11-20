import type { Metadata } from "next";
import { Protected } from "@/components/layout/Protected";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROLE_LABEL } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Mi cuenta" description="Los datos con los que ingresaste a TutorLink." />
      <Protected from={ROUTES.profile}>
        {({ user }) => (
          <Card className="max-w-xl space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={user.fullName} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-xl font-bold">{user.fullName}</p>
                <p className="truncate text-ink-soft">{user.email}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-muted">Roles</p>
              <ul className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <li key={role}>
                    <Badge tone="brand">{ROLE_LABEL[role]}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <LogoutButton className="text-danger-600 hover:text-danger-700" />
          </Card>
        )}
      </Protected>
    </>
  );
}
