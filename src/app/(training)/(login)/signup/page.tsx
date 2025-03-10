import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Registrazione",
};

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { redirect: redirectUrl = "/" } = await searchParams;

  if (await getSessionUser()) {
    return redirect(redirectUrl);
  }

  return <PageClient redirectUrl={redirectUrl} />;
}
