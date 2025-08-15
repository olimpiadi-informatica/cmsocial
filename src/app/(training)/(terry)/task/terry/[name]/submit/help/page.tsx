import { loadLocale } from "~/lib/locale";

import De from "./de.md";
import En from "./en.md";
import Es from "./es.md";
import Fr from "./fr.md";
import It from "./it.md";

export default async function Page() {
  const i18n = await loadLocale();

  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      {i18n.locale === "it-IT" && <It />}
      {i18n.locale === "en-GB" && <En />}
      {i18n.locale === "de-DE" && <De />}
      {i18n.locale === "es-ES" && <Es />}
      {i18n.locale === "fr-FR" && <Fr />}
    </div>
  );
}
