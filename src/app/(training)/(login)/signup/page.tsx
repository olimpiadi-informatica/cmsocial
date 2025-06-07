import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Registrazione",
};

export default async function Page() {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
  }

  return <PageClient captchaKey={process.env.CAPTCHA_PUBLIC_KEY!} />;
}
