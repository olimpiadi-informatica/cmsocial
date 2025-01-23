import { notFound, redirect } from "next/navigation";

import { getSubmission } from "~/lib/api/submission";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { SubmissionFiles } from "./files";
import { PageClient } from "./page-client";

type Props = {
  params: {
    name: string;
    id: string;
  };
};

export default async function Page({ params: { id, name } }: Props) {
  const user = getSessionUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/task/${name}/submissions/${id}`)}`);
  }

  const [_i18n, submission] = await Promise.all([loadLocale(), getSubmission(+id, name, user.id)]);
  if (!submission) notFound();

  return (
    <PageClient submission={submission}>
      <SubmissionFiles id={submission.id} language={submission.language} />
    </PageClient>
  );
}
