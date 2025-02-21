import { loadLocale } from "~/lib/locale";

import En from "./en.md";
import It from "./it.md";

export default async function Page() {
  const i18n = await loadLocale();

  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      {i18n.locale === "it" && <It />}
      {i18n.locale === "en" && <En />}
    </div>
  );
}
