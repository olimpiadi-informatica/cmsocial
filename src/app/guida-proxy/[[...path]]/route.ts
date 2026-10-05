import type { NextRequest } from "next/server";

import type { Element, Root } from "hast";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import type { Plugin } from "unified";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const guideUrl = "https://guida.oii.anpc.it/";

const rehypeSetBase: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "head") return;

      const base = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "base",
      );

      if (base) {
        base.properties.href = guideUrl;
      } else {
        node.children.unshift({
          type: "element",
          tagName: "base",
          properties: { href: guideUrl },
          children: [],
        });
      }
    });
  };
};

const rehypeFixBurgerMenu: Plugin<[], Root> = () => {
  const script = `(function () {
  var html = document.documentElement;
  var toggle = document.getElementById("sidebar-toggle");
  var sidebar = document.getElementById("sidebar");
  if (!toggle || !sidebar) return;

  function setVisible(visible) {
    html.classList.toggle("sidebar-visible", visible);
    html.classList.toggle("sidebar-hidden", !visible);
    toggle.setAttribute("aria-expanded", String(visible));
    sidebar.setAttribute("aria-hidden", String(!visible));
    Array.prototype.forEach.call(sidebar.querySelectorAll("a"), function (link) {
      link.setAttribute("tabIndex", visible ? "0" : "-1");
    });
    try {
      localStorage.setItem("shiroa-sidebar", visible ? "visible" : "hidden");
    } catch (e) {}
  }

  toggle.addEventListener("click", function () {
    setVisible(!html.classList.contains("sidebar-visible"));
  });

  sidebar.addEventListener("click", function (event) {
    if (window.innerWidth < 800 && event.target && event.target.tagName === "A") {
      setVisible(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 800) {
      var saved;
      try { saved = localStorage.getItem("shiroa-sidebar"); } catch (e) {}
      setVisible(saved !== "hidden");
    }
  });
})();`;

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "body") return;

      node.children.push({
        type: "element",
        tagName: "script",
        properties: {},
        children: [{ type: "text", value: script }],
      });
    });
  };
};

const rehypeRemoveCsp: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "meta") return;
      if (String(node.properties.httpEquiv).toLowerCase() !== "content-security-policy") return;
      if (parent && index != null) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
};

const rehypeStorageShim: Plugin<[], Root> = () => {
  const script = `(function () {
  try {
    window.localStorage.setItem("__shiroa_shim__", "1");
    window.localStorage.removeItem("__shiroa_shim__");
    return;
  } catch (e) {}

  function createStorage() {
    var data = {};
    return {
      getItem: function (key) {
        return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
      },
      setItem: function (key, value) { data[String(key)] = String(value); },
      removeItem: function (key) { delete data[key]; },
      clear: function () { data = {}; },
      key: function (index) {
        var keys = Object.keys(data);
        return index >= 0 && index < keys.length ? keys[index] : null;
      },
      get length() { return Object.keys(data).length; }
    };
  }

  try {
    Object.defineProperty(window, "localStorage", { configurable: true, value: createStorage() });
  } catch (e) {}
  try {
    Object.defineProperty(window, "sessionStorage", { configurable: true, value: createStorage() });
  } catch (e) {}
})();`;

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "head") return;

      node.children.unshift({
        type: "element",
        tagName: "script",
        properties: {},
        children: [{ type: "text", value: script }],
      });
    });
  };
};

const rehypeRewriteLinks: Plugin<[string], Root> = (origin) => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties.href;
      if (!href?.startsWith("/")) return;

      node.properties.href = `${origin}/guida-proxy${href}`;
      node.properties.target = "_self";
    });
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;

  const url = new URL(path.map(encodeURIComponent).join("/"), guideUrl);
  url.search = request.nextUrl.search;

  const response = await fetch(url);

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  if (!response.ok || !response.headers.get("content-type")?.startsWith("text/html")) {
    return new Response(response.body, { status: response.status, headers });
  }

  const host = request.headers.get("x-forwarded-host") ?? request.nextUrl.host;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol;
  const origin = `${proto}://${host}`;

  const html = await unified()
    .use(rehypeParse)
    .use(rehypeStorageShim)
    .use(rehypeSetBase)
    .use(rehypeFixBurgerMenu)
    .use(rehypeRemoveCsp)
    .use(rehypeRewriteLinks, origin)
    .use(rehypeStringify)
    .process(await response.bytes());

  return new Response(html.toString(), { headers });
}
