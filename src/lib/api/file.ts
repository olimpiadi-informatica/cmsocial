import { createHash } from "node:crypto";
import { openAsBlob } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

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

export async function saveFile(content: Buffer, description: string): Promise<string> {
  const digest = createHash("sha1").update(content).digest("hex");

  await cmsDb.transaction(async (tx) => {
    const res = await tx.execute(sql`SELECT digest FROM fsobjects WHERE digest = ${digest}`);
    if (res.rows.length > 0) {
      return digest;
    }

    const INV_WRITE = 0x20000;
    const INV_READ = 0x40000;

    const resOid = await tx.execute(sql`SELECT lo_creat(${INV_WRITE | INV_READ}) AS oid`);
    const oid = resOid.rows[0].oid;

    await tx.execute(sql`SELECT lo_put(${oid}, 0, ${content})`);

    await tx.execute(
      sql`INSERT INTO fsobjects (digest, loid, description) VALUES (${digest}, ${oid}, ${description})`,
    );
  });

  return digest;
}

export async function getTerryFileContent(fileName: string): Promise<Response> {
  const filePath = path.join(process.env.TERRY_FILES_PATH!, fileName);
  if (!(await isFile(filePath))) {
    return new Response(null, { status: 404 });
  }
  const blob = await openAsBlob(filePath);
  return new Response(blob, {
    headers: {
      "Cache-Control": "public, max-age=604800",
      "Content-Type": mime.getType(fileName) ?? "application/octet-stream",
    },
  });
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}
