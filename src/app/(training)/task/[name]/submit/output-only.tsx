"use client";

import Link from "next/link";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, MultipleFileField, SubmitButton } from "@olinfo/react-components";
import type { Task } from "@olinfo/training-api";
import { sortBy } from "lodash-es";
import { Send } from "lucide-react";

import { H2 } from "~/components/header";

import { submitOutputOnly } from "./actions";

export function SubmitOutputOnly({ task }: { task: Task }) {
  const { t } = useLingui();

  const validate = (files: Record<string, File>) => {
    for (const output of task.submission_format) {
      if (!files[output]) return t`File "${output}" mancante`;
    }
  };

  const submit = async ({ outputs }: { outputs: Record<string, File> }) => {
    const files = new FormData();
    for (const [name, file] of Object.entries(outputs)) {
      files.append(name, file);
    }

    const err = await submitOutputOnly(task, files);
    if (err) {
      switch (err) {
        case "Too frequent submissions!":
          throw new Error(t`Sottoposizioni troppo frequenti`);
        default:
          throw err;
      }
    }
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
        {sortBy(task.submission_format).map((file) => (
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
