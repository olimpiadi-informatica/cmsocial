import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    if (config.target[0] === "web") {
      config.target[1] = "es2022";
    }
    config.module.rules.push({
      test: /\.po$/,
      use: ["@lingui/loader"],
    });
    return config;
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
    serverActions: {
      bodySizeLimit: "10mb",
    },
    viewTransition: true,
  },
};

export default createMDX({ extension: /\.mdx?$/ })(nextConfig);
