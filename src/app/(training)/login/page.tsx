import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getMe } from "@olinfo/training-api";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Login",
};

type Props = {
  searchParams: {
    redirect?: string;
  };
};

export default async function Page({ searchParams: { redirect: redirectUrl = "/" } }: Props) {
  if (await getMe()) {
    return redirect(redirectUrl);
  }

  return <PageClient redirectUrl={redirectUrl} />;
}
