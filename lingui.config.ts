import type { LinguiConfig } from "@lingui/conf";
import { formatter } from "@lingui/format-po";

const config: LinguiConfig = {
  locales: ["it-IT", "en-GB", "de-DE", "es-ES", "fr-FR", "ro-RO", "hu-HU", "pl-PL"],
  sourceLocale: "it-IT",
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"],
    },
  ],
  format: formatter({
    origins: true,
    lineNumbers: false,
  }),
  compileNamespace: "es",
};

export default config;
