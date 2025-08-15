import { notFound } from "next/navigation";

import { MarkdownStatement } from "~/components/statement/markdown";
import { PdfStatement } from "~/components/statement/pdf";
import { getTerryFileContent } from "~/lib/api/file";
import { getTerryTask } from "~/lib/api/task-terry";
import { loadLocale } from "~/lib/locale";

import Submit from "./submit/page";

const EN_PDF_PREFIX =
  "> **Warning**: You can find the English version of the statement at [statement.pdf](statement.pdf)";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const { name } = await params;
  const i18n = await loadLocale();

  const task = await getTerryTask(name);
  if (!task) notFound();

  const statement = task.statementPath;
  const basePath = `/files${statement.replace(/\/[^/]*$/, "")}`;

  const source = await getTerryFileContent(statement).then((r) => r.text());

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <main className="overflow-x-hidden">
        {i18n.locale === "en-GB" && source.startsWith(EN_PDF_PREFIX) ? (
          <div className="relative min-h-[75vh] overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <PdfStatement url={`${basePath}/statement.pdf`} />
            </div>
          </div>
        ) : (
          <MarkdownStatement source={source.replace(EN_PDF_PREFIX, "")} basePath={basePath} />
        )}
      </main>
      <aside className="max-lg:hidden">
        <div className="my-6">
          <Submit params={params} />
        </div>
      </aside>
    </div>
  );
}
