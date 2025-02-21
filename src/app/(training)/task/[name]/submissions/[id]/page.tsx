import { getSubmission, getTask } from "@olinfo/training-api";
import { notFound } from "next/navigation";

import { loadLocale } from "~/lib/locale";

import { SubmissionFiles } from "./files";
import { PageClient } from "./page-client";

type Props = {
  params: {
    name: string;
    id: string;
  };
};

export default async function Page({ params: { id, name } }: Props) {
  const [_i18n, task, submission] = await Promise.all([
    loadLocale(),
    getTask(name),
    getSubmission(+id),
  ]);
  if (!task || !submission || submission.task_id !== task.id) notFound();

  return (
    <PageClient task={task} submission={submission}>
      <SubmissionFiles submission={submission} />
    </PageClient>
  );
}
