import { Trans } from "@lingui/macro";
import { Menu } from "@olinfo/react-components";
import { type SubmissionDetails, fileUrl } from "@olinfo/training-api";
import { sortBy } from "lodash-es";
import { Download } from "lucide-react";

import { H3 } from "~/components/header";
import { SourceCode } from "~/components/source-code";

export function SubmissionFiles({ submission }: { submission: SubmissionDetails }) {
  if (submission.files.length === 1)
    return (
      <>
        <H3 className="mb-2 mt-6">
          <Trans>Codice sorgente</Trans>
        </H3>
        <SourceCode url={fileUrl(submission.files[0])} />
      </>
    );

  return (
    <>
      <H3 className="mb-2 mt-6">File</H3>
      <Menu>
        {sortBy(submission.files, "name").map((file) => (
          <li key={file.name}>
            <a href={fileUrl(file)} className="grid-cols-[1fr_auto]" download>
              {file.name} <Download size={18} />
            </a>
          </li>
        ))}
      </Menu>
    </>
  );
}
