import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Iniciar sesión" };

async function LoginFormWithParams({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { from, expired } = await searchParams;
  return <LoginForm from={typeof from === "string" ? from : undefined} expired={expired === "1"} />;
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<Skeleton className="h-80" />}>
      <LoginFormWithParams searchParams={searchParams} />
    </Suspense>
  );
}
