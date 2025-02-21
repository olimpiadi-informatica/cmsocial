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
        source: "/user/:username/edit",
        destination: "/user/:username/edit/password",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://training.olinfo.it/api/:path*",
      },
      {
        source: "/api-terry/:path*",
        destination: "https://territoriali.olinfo.it/:path*",
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    if (config.target[0] === "web") {
      config.target[1] = "es2022";
    }
    return config;
  },
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },

  // https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-8.x-to-9.x#applications-using-older-versions-of-nextjs-may-require-a-workaround
  swcMinify: false,
};

export default createMDX({ extension: /\.mdx?$/ })(nextConfig);
