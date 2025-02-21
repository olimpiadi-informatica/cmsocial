import type { Metadata } from "next";

import { getContest } from "@olinfo/training-api";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Registrazione",
};

export default async function Page() {
  const contest = await getContest();
  return <PageClient contest={contest} />;
}
