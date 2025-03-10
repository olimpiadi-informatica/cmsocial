import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";
import { Download } from "lucide-react";

import { H3 } from "~/components/header";
import { SourceCode } from "~/components/source-code";
import { getSubmissionFiles } from "~/lib/api/submission";
import { Language, languageByName } from "~/lib/language";

export async function SubmissionFiles({ id, language }: { id: number; language: string | null }) {
  const lang = languageByName(language) ?? Language.Plain;
  const files = await getSubmissionFiles(id, lang);

  if (files.length === 1) {
    return (
      <>
        <H3 className="mb-2 mt-6">
          <Trans>Codice sorgente</Trans>
        </H3>
        <SourceCode url={files[0].url} lang={lang} />
      </>
    );
  }

  return (
    <>
      <H3 className="mb-2 mt-6">File</H3>
      <Menu>
        {files.map((file) => (
          <li key={file.name}>
            <a href={file.url} className="grid-cols-[1fr_auto]" download>
              {file.name} <Download size={18} />
            </a>
          </li>
        ))}
      </Menu>
    </>
  );
}
