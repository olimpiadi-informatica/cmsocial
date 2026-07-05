import { loadLocale } from "~/lib/locale";

const contents = import.meta.glob("./i18n-*.md", { eager: true, import: "default" }) as Record<
  string,
  ComponentType
>;

import type { ComponentType } from "react";

export default async function Page() {
  const i18n = await loadLocale();

  const Content = contents[`./i18n-${i18n.locale}.md`];

  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <Content />
    </div>
  );
}
