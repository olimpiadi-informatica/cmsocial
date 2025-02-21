import { notFound } from "next/navigation";

import { fileUrl, getTask } from "@olinfo/training-api";

import { loadLocale } from "~/lib/locale";

import Attachments from "./attachments/page";
import { Statement } from "./statement";
import Submit from "./submit/page";
import Tags from "./tags/page";

type Props = {
  params: { name: string };
};

export default async function Page({ params }: Props) {
  const i18n = await loadLocale();

  const task = await getTask(params.name);
  if (!task) notFound();

  const statement = fileUrl({
    name: "testo.pdf",
    digest: task.statements[i18n.locale] ?? Object.values(task.statements)[0],
  });

  return (
    <div className="grid grow gap-4 lg:grid-cols-[1fr_18rem]">
      <div className="relative min-h-[75vh] overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <Statement url={statement} title={task.title} />
        </div>
      </div>
      <div className="max-lg:hidden">
        <div className="grid gap-8">
          <Submit params={params} />
          <Attachments params={params} />
          <Tags params={params} />
        </div>
      </div>
    </div>
  );
}
