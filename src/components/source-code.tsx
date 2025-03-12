import { Suspense } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Code } from "@olinfo/react-components";
import { truncate } from "lodash-es";
import { Download, FileCode2 } from "lucide-react";

import { Language } from "~/lib/language";

type Props = {
  url: string;
  getFile: () => Promise<Response> | Response;
  lang: Language;
};

export function SourceCode({ url, getFile, lang }: Props) {
  const { t } = useLingui();

  if (lang === Language.Scratch) {
    return (
      <div className="grid justify-center">
        <a href={url} className="btn btn-primary" download>
          <FileCode2 size={22} /> <Trans>Scarica codice</Trans>
        </a>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-box border border-base-content/10">
      <Suspense fallback={<div className="skeleton h-[75vh]" />}>
        <SourceCodeInner getFile={getFile} lang={lang} />
      </Suspense>
      <div className="absolute right-0 top-0 flex rounded-bl-xl border-b border-l border-base-content/10 bg-base-100">
        <a
          href={url}
          className="btn btn-square btn-ghost forced-colors:border-none"
          aria-label={t`Scarica codice`}
          download>
          <Download />
        </a>
      </div>
    </div>
  );
}

type InnerProps = {
  getFile: () => Promise<Response> | Response;
  lang: Exclude<Language, Language.Scratch>;
};

export async function SourceCodeInner({ getFile, lang }: InnerProps) {
  const resp = await getFile();
  const source = await resp.text();

  return (
    <Code
      code={truncate(source, { length: 100_000 }).trimEnd()}
      lang={lang}
      className="max-h-[50vh] overflow-auto text-xs *:p-4"
    />
  );
}
