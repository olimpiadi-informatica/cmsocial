import { redirect } from "next/navigation";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const user = await getSessionUser();

  if (!user) {
    const loginUrl = `/delete-account?${new URLSearchParams(await searchParams)}`;
    redirect(`/login?redirect=${encodeURIComponent(loginUrl)}`);
  }

  return <PageClient />;
}
