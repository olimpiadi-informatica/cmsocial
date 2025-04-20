import type { ZodObject, ZodRawShape } from "zod";

export async function discourseApi<T, Shape extends ZodRawShape>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: `/${string}`,
  schema: ZodObject<Shape, any, any, T, any>,
): Promise<T> {
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

  if (!resp.ok) throw new Error((await resp.text()) ?? resp.statusText);

  const json = await resp.json();
  return schema.parse(json);
}
