import type { ReactNode } from "react";
import * as prod from "react/jsx-runtime";

import type { Element, Root } from "hast";
import rehypeKatex from "rehype-katex";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import type { Plugin } from "unified";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { type DiarioImage, DiarioImageGrid } from "~/components/diario-image-grid";

export type { DiarioImage };

export type RemoteDiario = {
  name: string;
  city: string;
  coordinates: [number, number];
  topicId: number;
  postIds: number[];
};

export type DiariMap = Record<string, Record<string, RemoteDiario>>;

export type DiarioItem = {
  contest: string;
  year: string;
  diario: RemoteDiario;
};

export function getDiario(contest: string, year: string): RemoteDiario | undefined {
  return diari[contest]?.[year];
}

export function getAllDiari(): DiarioItem[] {
  const items: DiarioItem[] = [];
  for (const [contest, years] of Object.entries(diari)) {
    for (const [year, diario] of Object.entries(years)) {
      items.push({ contest, year, diario });
    }
  }
  return items.sort((a, b) => b.diario.topicId - a.diario.topicId);
}

export const diari: DiariMap = {
  ioi: {
    "2022": {
      name: "IOI",
      city: "Yogyakarta",
      coordinates: [-7.7956, 110.3695],
      topicId: 7638,
      postIds: [1, 3, 4, 5, 6, 7, 8],
    },
    "2023": {
      name: "IOI",
      city: "Szeged",
      coordinates: [46.253, 20.1414],
      topicId: 8474,
      postIds: [1, 2, 3, 5, 6, 7, 8, 9, 10],
    },
    "2024": {
      name: "IOI",
      city: "Alessandria d'Egitto",
      coordinates: [31.2001, 29.9187],
      topicId: 9007,
      postIds: [1, 2, 3, 4, 5, 6, 8, 9, 12, 13],
    },
    "2025": {
      name: "IOI",
      city: "Sucre",
      coordinates: [-19.0196, -65.2619],
      topicId: 9677,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15],
    },
    "2026": {
      name: "IOI",
      city: "Tashkent",
      coordinates: [41.2995, 69.2401],
      topicId: 10049,
      postIds: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    },
  },
  iiot: {
    "2023": {
      name: "IIOT",
      city: "Port Said",
      coordinates: [31.2653, 32.3019],
      topicId: 8278,
      postIds: [1, 2, 3, 4, 5],
    },
    "2025": {
      name: "IIOT",
      city: "Budapest",
      coordinates: [47.4979, 19.0402],
      topicId: 9624,
      postIds: [1, 2, 3, 4, 6, 8, 9],
    },
    "2026": {
      name: "IIOT",
      city: "Piatra Neamț",
      coordinates: [46.9275, 26.3708],
      topicId: 9974,
      postIds: [1, 2, 3, 4],
    },
  },
  weoi: {
    "2023": {
      name: "WEOI",
      city: "Eindhoven",
      coordinates: [51.4416, 5.4697],
      topicId: 8332,
      postIds: [1],
    },
    "2024": {
      name: "WEOI",
      city: "Londra",
      coordinates: [51.5074, -0.1278],
      topicId: 8975,
      postIds: [1],
    },
    "2026": {
      name: "WEOI",
      city: "Lussemburgo",
      coordinates: [49.6116, 6.1319],
      topicId: 10014,
      postIds: [1, 2, 3],
    },
  },
  ceoi: {
    "2026": {
      name: "CEOI",
      city: "Lubiana",
      coordinates: [46.0569, 14.5058],
      topicId: 10019,
      postIds: [1, 2, 3, 4, 7, 8],
    },
  },
  egoi: {
    "2022": {
      name: "EGOI",
      city: "Antalya",
      coordinates: [36.8969, 30.7133],
      topicId: 7805,
      postIds: [1],
    },
    "2023": {
      name: "EGOI",
      city: "Lund",
      coordinates: [55.7047, 13.191],
      topicId: 8437,
      postIds: [1, 2, 3, 4, 5, 6, 7],
    },
  },
  ioai: {
    "2024": {
      name: "IAIO",
      city: "Riad",
      coordinates: [24.7136, 46.6753],
      topicId: 9025,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    "2026": {
      name: "IOAI",
      city: "Astana",
      coordinates: [51.1694, 71.4491],
      topicId: 10041,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8],
    },
  },
  "banca-italia": {
    "2023": {
      name: "Banca d'Italia",
      city: "Varsavia",
      coordinates: [52.2297, 21.0122],
      topicId: 8423,
      postIds: [1, 2, 4, 5, 6, 7, 8, 9],
    },
    "2024": {
      name: "Banca d'Italia",
      city: "Monaco di Baviera",
      coordinates: [48.1351, 11.582],
      topicId: 8978,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17],
    },
    "2025": {
      name: "Banca d'Italia",
      city: "Zurigo",
      coordinates: [47.3769, 8.5417],
      topicId: 9690,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    },
    "2026": {
      name: "Banca d'Italia",
      city: "Zurigo",
      coordinates: [47.3769, 8.5417],
      topicId: 10027,
      postIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
  },
};

type Response = {
  post_stream: {
    posts: Post<string>[];
  };
};

export type Post<Cooked = ReactNode> = {
  post_number: number;
  username: string;
  avatar_template: string;
  created_at: string;
  cooked: Cooked;
};

export async function getPosts(topicId: number, postIds: number[]): Promise<Post[]> {
  const resp = await fetch(`https://forum.olinfo.it/t/${topicId}/posts.json`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch topic ${topicId}: ${resp.status} ${resp.statusText}`);
  }
  const topic: Response = await resp.json();
  const allowedPostNumbers = new Set(postIds);

  const matchingPosts = topic.post_stream.posts.filter((post) =>
    allowedPostNumbers.has(post.post_number),
  );

  return Promise.all(
    matchingPosts.map(async (post) => ({
      ...post,
      cooked: await processHtml(post.cooked),
    })),
  );
}

function qualifyUrl(url: unknown): unknown {
  if (typeof url === "string" && url.startsWith("/")) {
    return `https://forum.olinfo.it${url}`;
  }
  return url;
}

const LINK_PROPERTIES: Record<string, string[]> = {
  a: ["href"],
  source: ["src"],
  img: ["src"],
  div: ["dataVideoSrc", "dataThumbnailSrc"],
};

const rehypeLinks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const props = LINK_PROPERTIES[node.tagName] ?? [];
      for (const prop of props) {
        if (node.properties[prop]) {
          node.properties[prop] = qualifyUrl(node.properties[prop]) as string;
        }
      }
    });
  };
};

export const rehypeMath: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const className = node.properties?.className;
      if (!className?.includes("math")) return;

      if (node.tagName === "span") {
        node.properties.className = ["math-inline"];
      } else if (node.tagName === "div") {
        node.properties.className = ["math-display"];
      }
    });
  };
};

const rehypeVideo: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "div" && node.properties?.className) {
        const classNames = node.properties.className as string[];
        if (classNames.includes("video-placeholder-container")) {
          const videoSrc = node.properties.dataVideoSrc as string;
          const thumbnailSrc = node.properties.dataThumbnailSrc as string;

          const videoElement: Element = {
            type: "element",
            tagName: "video",
            properties: {
              controls: true,
              preload: "metadata",
              poster: thumbnailSrc,
            },
            children: [
              {
                type: "element",
                tagName: "source",
                properties: {
                  src: videoSrc,
                  type: "video/mp4",
                },
                children: [],
              },
              {
                type: "text",
                value: "Il tuo browser non supporta il tag video.",
              },
            ],
          };

          if (parent && index != null) {
            parent.children[index] = videoElement;
          }
        }
      }
    });
  };
};

export const rehypeImageGrid: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      const classNames = (node.properties?.className as string[]) ?? [];
      if (!classNames.includes("d-image-grid")) return;

      const images: DiarioImage[] = [];

      visit(node, "element", (child, _, childParent) => {
        if (child.tagName === "img") {
          const imgProps = child.properties ?? {};
          const thumbSrc = (imgProps.src as string) ?? "";
          let fullSrc = thumbSrc;
          let title = (imgProps.alt as string) ?? "";

          if (childParent && childParent.type === "element" && childParent.tagName === "a") {
            const aProps = childParent.properties ?? {};
            if (aProps.href) {
              fullSrc = aProps.href as string;
            }
            if (aProps.title) {
              title = aProps.title as string;
            }
          }

          if (fullSrc || thumbSrc) {
            images.push({
              src: qualifyUrl(fullSrc) as string,
              thumbSrc: qualifyUrl(thumbSrc) as string,
              alt: (imgProps.alt as string) || title || "",
              title: title || (imgProps.alt as string) || undefined,
              width: imgProps.width ? Number(imgProps.width) : undefined,
              height: imgProps.height ? Number(imgProps.height) : undefined,
              dominantColor: imgProps.dataDominantColor
                ? (imgProps.dataDominantColor as string)
                : undefined,
            });
          }
        }
      });

      if (images.length === 0) {
        if (parent && index != null) {
          parent.children.splice(index, 1);
          return index;
        }
        return;
      }

      node.tagName = "diario-image-grid";
      node.properties = {
        images: JSON.stringify(images),
      };
      node.children = [];
    });
  };
};

const htmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeLinks)
  .use(rehypeMath)
  .use(rehypeVideo)
  .use(rehypeImageGrid)
  .use(rehypeKatex)
  .use(rehypeReact, {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
      "diario-image-grid": DiarioImageGrid,
    },
  });

export async function processHtml(html: string): Promise<ReactNode> {
  const file = await htmlProcessor.process(html);
  return file.result as ReactNode;
}
