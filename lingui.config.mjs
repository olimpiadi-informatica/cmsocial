/** @type {import('@lingui/conf').LinguiConfig} */
const config = {
  locales: ["it-IT", "en-GB", "de-DE", "es-ES", "fr-FR"],
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
