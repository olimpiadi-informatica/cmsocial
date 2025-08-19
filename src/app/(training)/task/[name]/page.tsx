import { notFound } from "next/navigation";

import { PdfStatement } from "~/components/statement/pdf";
import { getTaskStatement } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

import Attachments from "./attachments/page";
import Submit from "./submit/page";
import Tags from "./tags/page";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  const i18n = await loadLocale();
  const { name } = await params;

  const statement = await getTaskStatement(name, i18n.locale.replace(/-.*$/, ""));
  if (!statement) notFound();

  return (
    <div className="grid grow gap-4 lg:grid-cols-[1fr_18rem]">
      <main className="relative min-h-[75vh] overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <PdfStatement url={statement.url} />
        </div>
      </main>
      <aside className="max-lg:hidden">
        <div className="grid gap-8">
          <Submit params={params} />
          <Attachments params={params} />
          <Tags params={params} />
        </div>
      </aside>
    </div>
  );
}
