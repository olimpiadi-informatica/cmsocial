"use client";

import Link from "next/link";
import { useEffect, useReducer } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Button, Form, SingleFileField, SubmitButton, useIsAfter } from "@olinfo/react-components";
import { addSeconds } from "date-fns";
import { ArrowLeftRight, Download, Send, ServerCog, TimerIcon, TriangleAlert } from "lucide-react";

import { DateDistance } from "~/components/date";
import { H2 } from "~/components/header";
import type { TerryTask, TerryTaskInput } from "~/lib/api/task-terry";
import { Language, fileLanguage } from "~/lib/language";

import { changeInput, requestInput, uploadAndSubmit } from "./actions";

type Props = {
  task: TerryTask;
  input?: TerryTaskInput;
};

export function PageClient({ task, input }: Props) {
  const { _ } = useLingui();

  const expiryDate =
    input && task.submissionTimeout ? addSeconds(input.date, task.submissionTimeout) : undefined;
  const expired = useIsAfter(expiryDate);

  const validateSource = (file: File) => {
    const lang = fileLanguage(file.name);
    if (!lang || lang === Language.Plain) {
      return _(msg`Tipo di file non valido`);
    }
    const sizeLimit = lang === Language.Scratch ? 1_000_000 : 100_000;
    if (file.size > sizeLimit) {
      return _(msg`File troppo grande`);
    }
  };

  const validateOutput = (file: File) => {
    if (file.type !== "text/plain") {
      return _(msg`Tipo di file non valido`);
    }
    if (file.size > 1_000_000) {
      return _(msg`File troppo grande`);
    }
  };

  const onRequestInput = async () => {
    const err = await requestInput(task.name);
    if (err) throw new Error(err);
    await new Promise(() => {});
  };

  const onChangeInput = async () => {
    const err = await changeInput(input!.id);
    if (err) throw new Error(err);
    await new Promise(() => {});
  };

  const onSubmit = async (data: { source: File; output: File }) => {
    const files = new FormData();
    files.append("source", data.source);
    files.append("output", data.output);
    const err = await uploadAndSubmit(task.name, input!.id, files);
    if (err) throw new Error(err);
    await new Promise(() => {});
  };

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Ottieni input</Trans>
      </H2>
      {input ? (
        <>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`/api-terry/files/${input.path}`} download className="btn btn-primary">
              <Download /> <Trans>Scarica input</Trans>
            </a>
            <Button className="btn-primary" onClick={onChangeInput} icon={ArrowLeftRight}>
              <Trans>Cambia input</Trans>
            </Button>
          </div>
          <div className="mt-2 grid justify-center">
            {expired ? (
              <span className="text-sm text-error/70">
                <TriangleAlert className="inline-block align-text-bottom" size={16} />{" "}
                <Trans>Questo input è scaduto.</Trans>
              </span>
            ) : (
              expiryDate && <Timer date={expiryDate} />
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Button className="btn-primary" onClick={onRequestInput} icon={ServerCog}>
            <Trans>Richiedi input</Trans>
          </Button>
        </div>
      )}
      <div className="divider mx-auto w-full max-w-sm" />
      <Form onSubmit={onSubmit} disabled={!input || expired}>
        <H2>
          <Trans>Invia soluzione</Trans>
        </H2>
        <SingleFileField field="source" label={_(msg`File sorgente`)} validate={validateSource} />
        <SingleFileField field="output" label={_(msg`File di output`)} validate={validateOutput} />
        <SubmitButton icon={Send}>
          <Trans>Invia</Trans>
        </SubmitButton>
        <Link href={`/task/terry/${task.name}/submit/help`} className="link link-info mt-4">
          <Trans>Cosa devo inviare?</Trans>
        </Link>
      </Form>
    </div>
  );
}

function Timer({ date }: { date: Date }) {
  const [, refresh] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-sm text-base-content/80">
      <TimerIcon className="inline-block align-text-top" size={14} />{" "}
      <Trans>
        Questo input scade <DateDistance date={date} />.
      </Trans>
    </span>
  );
}
