"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Form, SelectField, SingleFileField, SubmitButton } from "@olinfo/react-components";
import clsx from "clsx";
import { mapValues } from "es-toolkit";
import { Send, TriangleAlert } from "lucide-react";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import type { Task } from "~/lib/api/task";
import { fileLanguage, Language } from "~/lib/language";

import { submitAction } from "./actions";
import { GuidelinesModal } from "./guidelines-modal";

const Editor = dynamic(() => import("./editor"), {
  loading: () => <div className="skeleton size-full rounded-none" />,
  ssr: false,
});

export function SubmitBatch({
  task,
  cookieLanguage,
  languages,
  guidelinesAccepted,
}: {
  task: Task;
  cookieLanguage?: string;
  languages: Record<string, Language>;
  guidelinesAccepted: boolean;
}) {
  const { t } = useLingui();
  const router = useRouter();

  const langMessage = (lang?: string) => {
    switch (languages[lang ?? ""]) {
      case Language.Pascal:
        return t(
          msg`Probabilmente hai sbagliato a selezionare il linguaggio, in caso contrario ti suggeriamo di smettere di usare Pascal e imparare un linguaggio più moderno.`,
        );
      case Language.Java:
        return t(
          msg`Assicurati di chiamare la tua classe "${task.submissionFormat[0].replace(".%l", "")}", altrimenti la compilazione non andrà a buon fine.`,
        );
    }
  };

  const validateFile = (file: File) => {
    if (file.size > 100_000) return t`File troppo grande`;
    if (!Object.values(languages).includes(fileLanguage(file.name)!)) {
      return t`Tipo di file non valido`;
    }
  };

  const [editorValue, setEditorValue] = useState<string>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const submit = async (value: { lang: string; src: File }) => {
    if (!guidelinesAccepted) {
      modalRef.current?.showModal();
      return;
    }

    const files = new FormData();
    files.append(task.submissionFormat[0], isSubmitPage ? (editorValue ?? "") : value.src);

    const { submissionId, error } = await submitAction(task.name, value.lang, files);
    if (error) throw new Error(t(error));
    router.push(`/task/${task.name}/submissions/${submissionId}`);

    await new Promise(() => {});
  };

  const isSubmitPage = usePathname().endsWith("/submit");
  const isOfficialSolution = editorValue?.includes("@check-accepted");

  const defaultLanguage = Object.entries(languages).find(
    ([_, lang]) => lang === cookieLanguage,
  )?.[0];

  return (
    <>
      <Form
        defaultValue={{ lang: defaultLanguage ?? Object.keys(languages)[0] }}
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
            label={t`Linguaggio`}
            options={mapValues(languages, (_, lang) => lang)}
          />
          <SingleFileField
            field="src"
            label={t`Codice sorgente`}
            validate={validateFile}
            optional={isSubmitPage}
          />
          <div className={clsx("flex-none", isSubmitPage && "md:mt-5")}>
            <SubmitButton disabled={isOfficialSolution} icon={Send}>
              <Trans>Invia</Trans>
            </SubmitButton>
          </div>
        </div>
        {({ lang }) => {
          const msg = langMessage(lang);
          if (!msg) return;
          return (
            <div className="mb-4 flex max-md:max-w-sm items-center gap-2 text-sm text-warning">
              <TriangleAlert size={16} className="flex-none" /> {msg}
            </div>
          );
        }}
        {isOfficialSolution && (
          <div className="mb-4 flex max-md:max-w-sm items-center gap-2 text-sm text-error">
            <TriangleAlert size={16} className="flex-none" />
            <div>
              <Trans>
                <b>
                  L'invio di soluzioni ufficiali è proibito dalle{" "}
                  <Link href="/guidelines" className="link link-info">
                    linee guida
                  </Link>
                  .
                </b>
              </Trans>
            </div>
          </div>
        )}
        <Link href={`/task/${task.name}/submit/help`} className="link link-info mb-4">
          <Trans>Come funziona l'input e l'output?</Trans>
        </Link>
        {isSubmitPage &&
          (({ lang, src }) => (
            <div className="relative min-h-[75vh] w-full mb-4 grow overflow-hidden rounded border border-base-content/10 *:absolute *:inset-0">
              <div className="skeleton rounded-none" />
              <Editor
                language={languages[lang ?? ""] ?? Language.Plain}
                languages={Object.values(languages)}
                file={src}
                onChange={setEditorValue}
              />
            </div>
          ))}
        {isSubmitPage && (
          <Link href="/guidelines" className="link link-info mb-4">
            <Trans>Linee guida sul codice sottoposto</Trans>
          </Link>
        )}
      </Form>
      <GuidelinesModal ref={modalRef} redirectTo={`/task/${task.name}/submit`} />
    </>
  );
}
