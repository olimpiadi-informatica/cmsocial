import { notFound } from "next/navigation";

import { Trans } from "@lingui/react/macro";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import { MarkdownStatement } from "~/components/statement/markdown";
import { PdfStatement } from "~/components/statement/pdf";
import { checkCanViewEditorial, getEditorialMarkdown } from "~/lib/editorials";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import Attachments from "../attachments/page";
import Submit from "../submit/page";
import Tags from "../tags/page";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  await loadLocale();
  const { name } = await params;
  const user = await getSessionUser();

  const access = await checkCanViewEditorial(name, user?.cmsId, user?.role === "admin");
  if (!access.hasEditorial) {
    notFound();
  }

  if (!user) {
    return (
      <div className="text-center">
        <H2>
          <Trans>Soluzione</Trans>
        </H2>
        <div className="my-2">
          <Trans>Accedi per inviare soluzioni</Trans>
        </div>
        <Link
          href={`/login?redirect=${encodeURIComponent(`/task/${name}/editorial`)}`}
          className="btn btn-primary">
          <Trans>Accedi</Trans>
        </Link>
      </div>
    );
  }

  if (!access.canView) {
    notFound();
  }

  const editorial = access.editorial;

  if (editorial.type === "pdf") {
    return (
      <div className="grid grow gap-4 lg:grid-cols-[1fr_18rem]">
        <main className="relative min-h-[75vh] overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <PdfStatement url={editorial.url} />
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

  const markdown = await getEditorialMarkdown(name);
  if (!markdown) {
    notFound();
  }

  return (
    <div className="grid grow gap-4 lg:grid-cols-[1fr_18rem]">
      <main className="min-w-0 rounded-lg bg-base-100 p-6 shadow-sm">
        <MarkdownStatement source={markdown} basePath="https://wiki.olinfo.it" />
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
