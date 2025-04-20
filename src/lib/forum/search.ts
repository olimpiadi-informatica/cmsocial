import { headers } from "next/headers";
import { userAgent } from "next/server";

import { compact } from "lodash-es";
import { parseEntities } from "parse-entities";
import { z } from "zod";

import { discourseApi } from "~/lib/forum/common";

const postSchema = z.object({
  id: z.number(),
  topic_id: z.number(),
  username: z.string(),
  avatar_template: z.string(),
  blurb: z.string().transform((s) => parseEntities(s)),
});

const topicSchema = z.object({
  id: z.number(),
  fancy_title: z.string().transform((s) => parseEntities(s)),
  slug: z.string(),
});

const responseSchema = z.object({
  posts: z.array(postSchema).optional(),
  topics: z.array(topicSchema).optional(),
});

export type ForumPost = {
  id: number;
  username: string;
  avatarUrl: string;
  title: string;
  description: string;
  url: string;
};

export async function searchForumPosts(query: string): Promise<ForumPost[]> {
  const ua = userAgent({ headers: await headers() });
  if (ua.isBot) return [];

  let resp: z.infer<typeof responseSchema>;
  try {
    resp = await discourseApi(
      "GET",
      `/search/query?term=${encodeURIComponent(query)}`,
      responseSchema,
    );
  } catch {
    return [];
  }
  const { posts, topics } = resp;
  if (!posts) return [];

  return compact(
    posts.map((post) => {
      const topic = topics?.find((topic) => topic.id === post.topic_id);
      if (!topic) return;

      return {
        id: post.id,
        username: post.username,
        avatarUrl: `https://forum.olinfo.it${post.avatar_template}`,
        title: topic.fancy_title,
        description: post.blurb,
        url: `https://forum.olinfo.it/t/${topic.slug}/${topic.id}`,
      };
    }),
  );
}
