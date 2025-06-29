import type { CompileOptions } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { fileLanguage } from "~/lib/language";

import "katex/dist/katex.css";

import style from "./markdown.module.css";

export function MarkdownStatement({ source, basePath }: { source: string; basePath: string }) {
  const mdxOptions: CompileOptions = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  };

  const mapUrl = (url?: string) => {
    return !url || URL.canParse(url) ? url : `${basePath}/${url}`;
  };

  const a: MDXComponents["a"] = ({ href, ...props }) => {
    const lang = fileLanguage(href);
    return <a {...props} href={mapUrl(href)} download={!!lang} />;
  };

  const img: MDXComponents["img"] = ({ src, alt, ...props }) => {
    return <img {...props} src={mapUrl(src)} alt={alt} />;
  };

  return (
    <div className={style.statement}>
      <MDXRemote options={{ mdxOptions }} components={{ a, img }} source={source} />
    </div>
  );
}
