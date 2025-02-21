import olinfoPresets from "@olinfo/tailwind";

/** @type {import("tailwindcss").Config} */
export default {
  presets: [olinfoPresets],
  content: [
    "./src/**/*.{js,mjs,ts,tsx,mdx}",
    "./node_modules/@olinfo/react-components/dist/**/*.js",
  ],
};
