import { YouTubeEmbed } from "@next/third-parties/google";
import { BookText, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Resources({ children }: { children: ReactNode }) {
  return <div className="sm:columns-2 lg:columns-3">{children}</div>;
}

type ListProps = {
  title?: string;
  children: ReactNode;
};

export function ResourceList({ title = "Risorse", children }: ListProps) {
  return (
    <div className="rounded-xl bg-base-200 border border-base-content/10 shadow-xl p-6 grid gap-3 prose-p:m-0 prose-hr:m-0 prose-headings:m-0 break-inside-avoid mb-4">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

type LinkProps = {
  title: string;
  subtitle?: string;
  url: string;
  icon: LucideIcon;
};

export function ResourceLink({ title, subtitle, url, icon: Icon }: LinkProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Icon />
        <div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400">
            {title}
          </a>
          {subtitle && <div className="italic text-sm">{subtitle}</div>}
        </div>
      </div>
      <hr className="last:hidden" />
    </>
  );
}

type VideoProps = {
  id: string;
  title: string;
  author: string;
  params?: string;
  buttons?: { label: string; url: string }[];
};

export function ResourceVideo({ id, title, author, params = "", buttons }: VideoProps) {
  return (
    <div className="rounded-xl bg-base-200 border border-base-content/10 shadow-xl p-4 grid gap-1 break-inside-avoid mb-4">
      <div className="rounded overflow-hidden">
        <YouTubeEmbed videoid={id} params={`controls=1&${params}`} />
      </div>
      <h2 className="px-2 !mt-2 !mb-0">{title}</h2>
      <div className="px-2 italic text-sm">di {author}</div>
      {buttons && (
        <div className="flex flex-wrap gap-2 justify-center mt-2 not-prose">
          {buttons.map((btn) => (
            <a
              key={btn.url}
              href={btn.url}
              target="_blank"
              rel="noreferrer"
              className="h-10 btn btn-primary btn-sm">
              <BookText className="inline !m-0" size={18} /> {btn.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
