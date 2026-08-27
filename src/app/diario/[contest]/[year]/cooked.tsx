"use client";

import { use, useRef } from "react";

import clsx from "clsx";

import type { Post } from "~/lib/diari";

import cookedStyles from "./cooked.module.css";

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function Cooked({
  postsData: postsDataPromise,
  onContainerMount,
}: {
  postsData: Promise<Post[]>;
  onContainerMount: (el: HTMLDivElement | null) => void;
}) {
  const postsData = use(postsDataPromise);
  const postsContainerRef = useRef<HTMLDivElement | null>(null);

  const setContainerRef = (el: HTMLDivElement | null) => {
    postsContainerRef.current = el;
    onContainerMount(el);
  };

  return (
    <div id="posts-container" ref={setContainerRef} className="relative space-y-12">
      {postsData.map((post) => (
        <article
          key={post.post_number}
          id={`post-${post.post_number}`}
          className="space-y-4 pt-8 first:pt-4 border-t border-stone-200">
          <div className="flex items-center justify-end text-xs text-stone-500 pb-2">
            <span>
              Pubblicato da{" "}
              <a
                href={`https://forum.olinfo.it/u/${post.username}`}
                className="text-blue-700 underline">
                @{post.username}
              </a>{" "}
              il {dateFormatter.format(new Date(post.created_at))}
            </span>
          </div>
          <div
            className={clsx(
              "prose max-w-none prose-headings:font-serif prose-headings:text-stone-900 prose-p:leading-relaxed prose-a:text-blue-700 hover:prose-a:underline",
              cookedStyles.cooked,
            )}>
            {post.cooked}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CookedLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-spinner loading-lg text-stone-400" />
    </div>
  );
}
