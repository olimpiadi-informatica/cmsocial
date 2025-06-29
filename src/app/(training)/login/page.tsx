import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Login",
};

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { redirect: redirectUrl = "/" } = await searchParams;

  if (await getSessionUser()) {
    redirect(redirectUrl);
  }

  return <PageClient redirectUrl={redirectUrl} />;
}
