"use client";

import { useRouter } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, MultipleFileField, SubmitButton } from "@olinfo/react-components";
import { sortBy, sumBy } from "lodash-es";
import { Send } from "lucide-react";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import type { Task } from "~/lib/api/task";

import { submitAction } from "./actions";

export function SubmitOutputOnly({ task }: { task: Task }) {
  const { t } = useLingui();
  const router = useRouter();

  const validate = (files: Record<string, File>) => {
    for (const output of task.submissionFormat) {
      if (!files[output]) return t`File "${output}" mancante`;
      if (files[output].size > 75_000_000) return t`File troppo grande`;
    }
    const totalSize = sumBy(Object.values(files), (f) => f.size);
    if (totalSize > 150_000_000) return t`File troppo grandi`;
  };

  const submit = async ({ outputs }: { outputs: Record<string, File> }) => {
    const files = new FormData();
    for (const [name, file] of Object.entries(outputs)) {
      files.append(name, file);
    }

    const { submissionId, error } = await submitAction(task.name, null, files);
    if (error) throw new Error(t(error));
    router.push(`/task/${task.name}/submissions/${submissionId}`);

    await new Promise(() => {});
  };

  return (
    <Form onSubmit={submit}>
      <H2>
        <Trans>Invia output</Trans>
      </H2>
      <div>
        <Trans>Devi inviare i seguenti file:</Trans>
      </div>
      <div className="columns-2 text-sm">
        {sortBy(task.submissionFormat).map((file) => (
          <div key={file}>{file}</div>
        ))}
      </div>
      <MultipleFileField
        field="outputs"
        label={t`File di output`}
        accept=".txt"
        validate={validate}
      />
      <SubmitButton icon={Send}>
        <Trans>Invia</Trans>
      </SubmitButton>
      <Link href={`/task/${task.name}/submit/help`} className="link link-info mb-4">
        <Trans>Come funziona l'input e l'output?</Trans>
      </Link>
    </Form>
  );
}
