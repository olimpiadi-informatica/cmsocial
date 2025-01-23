import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Login",
};

type Props = {
  searchParams: {
    redirect?: string;
  };
};

export default function Page({ searchParams: { redirect: redirectUrl = "/" } }: Props) {
  if (getSessionUser()) {
    return redirect(redirectUrl);
  }

  return <PageClient redirectUrl={redirectUrl} />;
}
