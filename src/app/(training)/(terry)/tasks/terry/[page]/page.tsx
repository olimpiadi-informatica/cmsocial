import type { Metadata } from "next";

import { getTerryTasks } from "~/lib/api/tasks-terry";
import { getSessionUser } from "~/lib/user";

import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Territoriali",
  description:
    "Lista dei problemi delle Selezioni Territoriali della piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

export default async function Page() {
  const user = await getSessionUser();
  const tasks = await getTerryTasks(user?.username);
  return <PageClient tasks={tasks} />;
}
