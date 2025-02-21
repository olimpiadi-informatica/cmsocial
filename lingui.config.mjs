/** @type {import('@lingui/conf').LinguiConfig} */
const config = {
  locales: ["it", "en"],
  sourceLocale: "it",
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
