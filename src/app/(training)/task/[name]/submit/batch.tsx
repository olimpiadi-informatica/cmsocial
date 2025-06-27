"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Form, SelectField, SingleFileField, SubmitButton } from "@olinfo/react-components";
import clsx from "clsx";
import { mapValues } from "lodash-es";
import { Send, TriangleAlert } from "lucide-react";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import type { Task } from "~/lib/api/task";
import { fileLanguage, Language } from "~/lib/language";

import { submitBatch } from "./actions";

const Editor = dynamic(() => import("./editor"), {
  loading: () => <div className="skeleton size-full rounded-none" />,
  ssr: false,
});

export function SubmitBatch({
  task,
  languages,
}: {
  task: Task;
  languages: Record<string, Language>;
}) {
  const { _ } = useLingui();

  const langMessage = (lang?: string) => {
    switch (languages[lang ?? ""]) {
      case Language.Pascal:
        return _(
          msg`Probabilmente hai sbagliato a selezionare il linguaggio, in caso contrario ti suggeriamo di smettere di usare Pascal e imparare un linguaggio più moderno.`,
        );
      case Language.Java:
        return _(
          msg`Assicurati di chiamare la tua classe "${task.submissionFormat[0].replace(".%l", "")}", altrimenti la compilazione non andrà a buon fine.`,
        );
    }
  };

  const validateFile = (file: File) => {
    if (file.size > 100_000) return _(msg`File troppo grande`);
    if (!Object.values(languages).includes(fileLanguage(file.name)!)) {
      return _(msg`Tipo di file non valido`);
    }
  };

  const [editorValue, setEditorValue] = useState<string>();
  const submit = async (value: { lang: string; src: File }) => {
    const files = new FormData();
    files.append(task.submissionFormat[0], isSubmitPage ? (editorValue ?? "") : value.src);

    const err = await submitBatch(task.name, value.lang, files);
    if (err) throw new Error(_(err));
    await new Promise(() => {});
  };

  const isSubmitPage = usePathname().endsWith("/submit");

  return (
    <Form
      defaultValue={{ lang: Object.keys(languages)[0] }}
      onSubmit={submit}
      className="!max-w-full grow">
      <H2>
        <Trans>Invia soluzione</Trans>
      </H2>
      <div
        className={clsx(
          "mb-4 flex w-full max-w-sm flex-col items-center",
          isSubmitPage && "md:max-w-3xl md:flex-row md:items-start md:gap-4",
        )}>
        <SelectField
          field="lang"
          label={_(msg`Linguaggio`)}
          options={mapValues(languages, (_, lang) => lang)}
        />
        <SingleFileField
          field="src"
          label={_(msg`Codice sorgente`)}
          validate={validateFile}
          optional={isSubmitPage}
        />
        <div className={clsx("flex-none", isSubmitPage && "md:mt-5")}>
          <SubmitButton icon={Send}>
            <Trans>Invia</Trans>
          </SubmitButton>
        </div>
      </div>
      {({ lang }) => {
        const msg = langMessage(lang);
        if (!msg) return;
        return (
          <div className="mb-4 flex max-w-sm items-center gap-2 text-sm text-warning">
            <TriangleAlert size={16} className="flex-none" /> {msg}
          </div>
        );
      }}
      <Link href={`/task/${task.name}/submit/help`} className="link link-info mb-4">
        <Trans>Come funziona l'input e l'output?</Trans>
      </Link>
      {isSubmitPage &&
        (({ lang, src }) => (
          <div className="relative min-h-[75vh] w-full grow overflow-hidden rounded border border-base-content/10 *:absolute *:inset-0">
            <div className="skeleton rounded-none" />
            <Editor
              language={languages[lang ?? ""] ?? Language.Plain}
              languages={Object.values(languages)}
              file={src}
              onChange={setEditorValue}
            />
          </div>
        ))}
    </Form>
  );
}
