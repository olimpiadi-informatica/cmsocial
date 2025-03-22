import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core/columns";
import mime from "mime";

import { cmsDb } from "~/lib/db";

export type File = {
  name: string;
  digest: string;
  url: string;
};

export function getFile(name: PgColumn | string, digest: PgColumn): SQL<string> {
  return sql<string>`'/files/' || ${digest} || '/' || ${name}`;
}

export async function getFileContent(file: Omit<File, "url">) {
  const res = await cmsDb.execute(sql`SELECT loid FROM fsobjects WHERE digest = ${file.digest}`);
  const oid = res.rows[0]?.loid;
  if (!oid) {
    return new Response(null, { status: 404 });
  }

  const chunkSize = 1 << 16;
  let offset = 0;

  return new Response(
    new ReadableStream({
      async pull(controller) {
        const res = await cmsDb.execute(
          sql`SELECT lo_get(${oid}, ${offset}, ${chunkSize}) AS buffer`,
        );
        offset += chunkSize;

        const buffer = res.rows[0].buffer as Buffer;
        controller.enqueue(buffer);
        if (buffer.length === 0) {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": mime.getType(file.name) ?? "application/octet-stream",
      },
    },
  );
}

export function getTerryFileContent(fileName: string): Response {
  const filePath = path.join(process.env.TERRY_FILES_PATH!, fileName);
  if (!existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }
  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Cache-Control": "public, max-age=604800",
      "Content-Type": mime.getType(fileName) ?? "application/octet-stream",
    },
  });
}
