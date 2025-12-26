import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  productionBrowserSourceMaps: true,
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/overview",
        destination: "/",
        permanent: false,
      },
      {
        source: "/task/:name/statement",
        destination: "/task/:name",
        permanent: false,
      },
      {
        source: "/user/:username/profile",
        destination: "/user/:username",
        permanent: false,
      },
      {
        source: "/user/:username/edit(.*)",
        destination: "/settings/profile",
        permanent: false,
      },
      {
        source: "/(wp-|\.git|\.env)(.*)",
        destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "header",
            key: "referer",
            value: "https://training.olinfo.it/wp-admin/",
          },
        ],
        destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.po": {
        loaders: ["@lingui/loader"],
        as: "*.js",
      }
    }
  },
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
};

export default createMDX({ extension: /\.mdx?$/ })(nextConfig);
