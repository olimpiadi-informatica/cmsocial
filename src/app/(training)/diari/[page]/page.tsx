import type { Metadata } from "next";

import { getAllDiari } from "~/lib/diari";
import { loadLocale } from "~/lib/locale";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Diari",
  description:
    "Lista dei diari olimpici della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

export default async function Page() {
  await loadLocale();
  const allDiari = getAllDiari();

  return <PageClient diari={allDiari} />;
}
