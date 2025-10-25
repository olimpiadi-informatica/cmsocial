import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["it-IT", "en-GB", "de-DE", "es-ES", "fr-FR", "ro-RO", "hu-HU", "pl-PL"],
  sourceLocale: "it-IT",
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"],
    },
  ],
  format: "po",
  formatOptions: {
    origins: true,
    lineNumbers: false,
  },
  compileNamespace: "es",
};

export default config;
