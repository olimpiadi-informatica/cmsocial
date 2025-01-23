import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUser } from "@olinfo/terry-api";

import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Territoriali",
  description:
    "Lista dei problemi delle Selezioni Territoriali della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

type Props = {
  params: { page: string };
};

export default async function Page({ params: { page } }: Props) {
  const trainingUser = getSessionUser();
  if (!trainingUser) {
    redirect(`/login?redirect=${encodeURIComponent(`/tasks/terry/${page}`)}`);
  }

  const user = await getUser(trainingUser.username);
  return <PageClient user={user} />;
}
