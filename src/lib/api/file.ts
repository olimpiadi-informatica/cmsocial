import { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core/columns";

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
  const oid = res.rows[0].loid;

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
  );
}

export function getTerryFileContent(filePath: string): Response {
  const stream = createReadStream(path.join(process.env.TERRY_FILES_PATH!, filePath));
  return new Response(Readable.toWeb(stream) as ReadableStream);
}
