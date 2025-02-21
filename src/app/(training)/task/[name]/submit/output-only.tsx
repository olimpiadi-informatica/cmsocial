"use client";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Form, MultipleFileField, SubmitButton } from "@olinfo/react-components";
import type { Task } from "@olinfo/training-api";
import { sortBy } from "lodash-es";
import { Send } from "lucide-react";

import { H2 } from "~/components/header";

import { submitOutputOnly } from "./actions";

export function SubmitOutputOnly({ task }: { task: Task }) {
  const { _ } = useLingui();

  const validate = (files: Record<string, File>) => {
    for (const output of task.submission_format) {
      if (!files[output]) return _(msg`File "${output}" mancante`);
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
          throw new Error(_(msg`Sottoposizioni troppo frequenti`));
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
        label={_(msg`File di output`)}
        accept=".txt"
        validate={validate}
      />
      <SubmitButton icon={Send}>
        <Trans>Invia</Trans>
      </SubmitButton>
    </Form>
  );
}
