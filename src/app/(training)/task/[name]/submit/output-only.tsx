"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, MultipleFileField, SubmitButton } from "@olinfo/react-components";
import { sortBy } from "lodash-es";
import { Send } from "lucide-react";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import type { Task } from "~/lib/api/task";

import { submitOutputOnly } from "./actions";

export function SubmitOutputOnly({ task }: { task: Task }) {
  const { _ } = useLingui();

  const validate = (files: Record<string, File>) => {
    for (const output of task.submissionFormat) {
      if (!files[output]) return _(msg`File "${output}" mancante`);
    }
  };

  const submit = async ({ outputs }: { outputs: Record<string, File> }) => {
    const files = new FormData();
    for (const [name, file] of Object.entries(outputs)) {
      files.append(name, file);
    }

    const err = await submitOutputOnly(task.name, files);
    if (err) throw new Error(_(err));
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
        label={_(msg`File di output`)}
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
