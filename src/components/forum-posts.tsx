import type { ReactNode } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { type ForumPost, searchForumPosts } from "~/lib/forum";

type Props = {
  taskName: string;
  taskTitle: string;
  taskUrl: string;
};

export async function ForumPosts({ taskName, taskTitle, taskUrl }: Props) {
  const { _ } = useLingui();

  const posts = await searchForumPosts(taskTitle);

  if (!posts.length) {
    return (
      <div className="text-center">
        <Trans>Nessun post trovato.</Trans>
        <div className="h-4" />
        <ForumLinks taskName={taskName} taskTitle={taskTitle} taskUrl={taskUrl} />
      </div>
    );
  }

  const avatar = (post: ForumPost, scale: number) =>
    post.avatarUrl.replace("{size}", String(48 * scale));

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          className="bg-base-200 rounded-box p-4 grid grid-cols-[auto,1fr] gap-4"
          target="_blank"
          rel="noreferrer">
          <div className="avatar p-1.5">
            <div className="rounded-lg size-12">
              <img
                src={avatar(post, 1)}
                srcSet={`${avatar(post, 1)} 1x, ${avatar(post, 2)} 2x, ${avatar(post, 3)} 3x`}
                alt={_(msg`Foto profilo di ${post.username}`)}
              />
            </div>
          </div>
          <div>
            <div className="text-lg">
              <span className="link link-info">
                <Highlight keyword={taskTitle}>{post.title}</Highlight>
              </span>
            </div>
            <div>
              <Highlight keyword={taskTitle}>{post.description}</Highlight>
            </div>
          </div>
        </a>
      ))}
      <div className="text-center">
        <ForumLinks taskName={taskName} taskTitle={taskTitle} taskUrl={taskUrl} />
      </div>
    </div>
  );
}

function Highlight({ keyword, children }: { keyword: string; children: string }) {
  const lowerChildren = children.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const parts: ReactNode[] = [];
  let prevPos = 0;
  let pos = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: clearer this way
  while ((pos = lowerChildren.indexOf(lowerKeyword, prevPos)) !== -1) {
    parts.push(children.slice(prevPos, pos));
    parts.push(
      <mark key={pos} className="bg-warning/80 rounded-sm">
        {children.slice(pos, pos + keyword.length)}
      </mark>,
    );
    prevPos = pos + keyword.length;
  }
  parts.push(children.slice(prevPos));

  return parts;
}

function ForumLinks({ taskName, taskTitle, taskUrl }: Props) {
  return (
    <div className="text-center">
      <a
        href="https://forum.olinfo.it/search"
        target="_blank"
        rel="noreferrer"
        className="link link-info">
        <Trans>Cerca altri argomenti</Trans>
      </a>
      <br />
      <a
        href={newPostUrl(taskName, taskTitle, taskUrl)}
        target="_blank"
        rel="noreferrer"
        className="link link-info">
        <Trans>Crea un nuovo argomento</Trans>
      </a>
    </div>
  );
}

function newPostUrl(taskName: string, taskTitle: string, taskUrl: string) {
  const url = new URL("https://forum.olinfo.it/new-topic");
  url.searchParams.append("title", `Aiuto per ${taskTitle} (${taskName})`);
  url.searchParams.append(
    "body",
    `\
Ciao a tutti, ho bisogno di aiuto per risolvere il problema [${taskTitle}](https://training.olinfo.it${taskUrl}).

[SPIEGARE COSA NON FUNZIONA QUI]

Ecco il mio codice:
\`\`\`cpp
// INSERISCI QUI IL TUO CODICE
\`\`\`

Grazie mille in anticipo!`,
  );
  url.searchParams.append("category", "Aiuto");

  return url.href;
}
