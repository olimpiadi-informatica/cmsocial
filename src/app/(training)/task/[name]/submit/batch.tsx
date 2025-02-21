"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Form, SelectField, SingleFileField, SubmitButton } from "@olinfo/react-components";
import type { Task } from "@olinfo/training-api";
import clsx from "clsx";
import { Send, TriangleAlert } from "lucide-react";

import { H2 } from "~/components/header";
import { Language, fileLanguage } from "~/lib/language";

import { submitBatch } from "./actions";

const Editor = dynamic(() => import("./editor"), {
  loading: () => <div className="skeleton size-full rounded-none" />,
  ssr: false,
});

export function SubmitBatch({ task }: { task: Task }) {
  const { _ } = useLingui();

  const languages = useMemo(() => task.supported_languages.map((l) => compilerLang(l)), [task]);

  const langMessage = (lang?: string) => {
    switch (compilerLang(lang)) {
      case Language.Pascal:
        return _(
          msg`Probabilmente hai sbagliato a selezionare il linguaggio, in caso contrario ti suggeriamo di smettere di usare Pascal e imparare un linguaggio più moderno.`,
        );
      case Language.Java:
        return _(
          msg`Assicurati di chiamare la tua classe "${task.submission_format[0].replace(".%l", "")}", altrimenti la compilazione non andrà a buon fine.`,
        );
    }
  };

  const validateFile = (file: File) => {
    if (file.size > 100_000) return _(msg`File troppo grande`);
    if (!task.supported_languages.some((l) => fileLanguage(file.name) === compilerLang(l))) {
      return _(msg`Tipo di file non valido`);
    }
  };

  const [editorValue, setEditorValue] = useState<string>();
  const submit = async (value: { lang: string; src: File }) => {
    const files = new FormData();
    if (isSubmitPage) {
      files.append("src", new File([editorValue ?? ""], value.src?.name ?? "source.txt"));
    } else {
      files.append("src", value.src);
    }

    const err = await submitBatch(task, value.lang, files);
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

  const isSubmitPage = usePathname().endsWith("/submit");

  return (
    <Form
      defaultValue={{ lang: task.supported_languages[0] }}
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
          options={Object.fromEntries(task.supported_languages.map((l) => [l, l]))}
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
      {task.attachments.some((a) => a.name.startsWith("grader")) && (
        <Link href="https://wiki.olinfo.it/Guide/grader" className="link link-info mb-4">
          <Trans>Come si usano i grader?</Trans>
        </Link>
      )}
      {isSubmitPage &&
        (({ lang, src }) => (
          <div className="relative min-h-[75vh] w-full grow overflow-hidden rounded border border-base-content/10 *:absolute *:inset-0">
            <div className="skeleton rounded-none" />
            <Editor
              language={compilerLang(lang)}
              languages={languages}
              file={src}
              onChange={setEditorValue}
            />
          </div>
        ))}
    </Form>
  );
}

function compilerLang(compiler?: string) {
  const lang = compiler?.match(/^[+A-Za-z]+/)?.[0];
  switch (lang) {
    case "C":
      return Language.C;
    case "C++":
      return Language.Cpp;
    case "Java":
      return Language.Java;
    case "Python":
      return Language.Python;
    case "Pascal":
      return Language.Pascal;
    default:
      return Language.Plain;
  }
}
