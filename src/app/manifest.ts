import type { MetadataRoute } from "next";

import iconMask from "./icon-mask.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Allenamento Olimpiadi Italiane di Informatica",
    short_name: "Allenamento OII",
    description: "Piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
    start_url: "/",
    display: "standalone",
    orientation: "natural",
    background_color: "#faf7f5",
    theme_color: "#faf7f5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon0.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon1.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: iconMask.src,
        sizes: `${iconMask.width}x${iconMask.height}`,
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
