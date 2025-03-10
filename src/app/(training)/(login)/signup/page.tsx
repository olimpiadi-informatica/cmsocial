import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getContest, getMe } from "@olinfo/training-api";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Registrazione",
};

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { redirect: redirectUrl = "/" } = await searchParams;

  if (await getMe()) {
    return redirect(redirectUrl);
  }

  const contest = await getContest();
  return <PageClient contest={contest} redirectUrl={redirectUrl} />;
}
