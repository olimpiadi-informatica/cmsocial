import type { ZodType } from "zod";

export async function discourseApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: `/${string}`,
  schema: ZodType<T>,
): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Api-Key": process.env.FORUM_API_KEY!,
    "Api-Username": process.env.FORUM_API_USERNAME!,
  };

  const resp = await fetch(`https://forum.olinfo.it${endpoint}`, {
    method,
    headers,
    cache: "no-store",
  });

  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error((await resp.text()) ?? resp.statusText);

  const json = await resp.json();
  return schema.parse(json);
}
