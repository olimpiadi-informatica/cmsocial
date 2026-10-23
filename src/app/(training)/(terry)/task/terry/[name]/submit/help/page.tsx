import { loadLocale } from "~/lib/locale";

import De from "./i18n-de-DE.md";
import En from "./i18n-en-GB.md";
import Es from "./i18n-es-ES.md";
import Fr from "./i18n-fr-FR.md";
import Hu from "./i18n-hu-HU.md";
import It from "./i18n-it-IT.md";
import Pl from "./i18n-pl-PL.md";
import Ro from "./i18n-ro-RO.md";

export default async function Page() {
  const i18n = await loadLocale();

  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      {i18n.locale === "it-IT" && <It />}
      {i18n.locale === "en-GB" && <En />}
      {i18n.locale === "de-DE" && <De />}
      {i18n.locale === "es-ES" && <Es />}
      {i18n.locale === "fr-FR" && <Fr />}
      {i18n.locale === "ro-RO" && <Ro />}
      {i18n.locale === "hu-HU" && <Hu />}
      {i18n.locale === "pl-PL" && <Pl />}
    </div>
  );
}
