import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { create as createContentDisposition } from "content-disposition";
import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core/columns";
import { lookup as lookupMime } from "mrmime";
import parseRange from "range-parser";

import { cmsDb, filesDb } from "~/lib/db";
import { fileLanguage, isBinaryLanguage } from "~/lib/language";

export type File = {
  name: string;
  digest: string;
  url: string;
};

export function getFile(name: PgColumn | string, digest: PgColumn): SQL<string> {
  return sql<string>`'/files/' || ${digest} || '/' || ${name}`;
}

const CHUNK_SIZE = 1 << 20;
// Keep the next chunk in flight while the current one is being delivered.
// `Readable.from` would otherwise default to `highWaterMark: 1` and serialize
// the database reads, with no prefetch.
const PREFETCH_SIZE = 2 * CHUNK_SIZE;
const INV_READ = 0x40000;
const INV_WRITE = 0x20000;

type FileMeta = {
  loid: number;
  size: number;
};

async function getFileMeta(digest: string): Promise<FileMeta | null> {
  const res = await filesDb.execute(
    sql`SELECT loid, lo_lseek64(lo_open(loid, ${INV_READ}), 0, 2) AS size FROM fsobjects WHERE digest = ${digest}`,
  );
  const row = res.rows[0];
  if (!row) return null;

  return { loid: Number(row.loid), size: Number(row.size) };
}

async function readChunk(
  meta: FileMeta,
  offset: number,
  length: number,
): Promise<Buffer | undefined> {
  const res = await filesDb.execute(
    sql`SELECT lo_get(${meta.loid}, ${offset}, ${length}) AS buffer`,
  );
  return res.rows[0]?.buffer as Buffer;
}

function createFileStream(meta: FileMeta, start: number, endExclusive: number): Readable {
  const chunks = async function* () {
    for (let offset = start; offset < endExclusive; ) {
      const buffer = await readChunk(meta, offset, Math.min(CHUNK_SIZE, endExclusive - offset));
      if (buffer == null || buffer.length === 0) {
        throw new Error(`Unexpected end of large object ${meta.loid}`);
      }

      offset += buffer.length;
      yield buffer;
    }
  };

  // objectMode must stay disabled: otherwise highWaterMark counts chunks instead of
  // bytes, and a single 1 MiB chunk would skip backpressure entirely. With a byte
  // highWaterMark the stream keeps a chunk in flight while the current one is being
  // delivered, and Readable.toWeb destroys the stream (calling the generator's
  // return()) when the response body is cancelled.
  return Readable.from(chunks(), { objectMode: false, highWaterMark: PREFETCH_SIZE });
}

export async function getFileContent(file: Omit<File, "url">, request?: Request) {
  const meta = await getFileMeta(file.digest);
  if (!meta) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Disposition": createContentDisposition(file.name, { type: "inline" }),
  });

  return createRangeStream(file.name, meta.size, request, headers, (start, endExclusive) =>
    createFileStream(meta, start, endExclusive),
  );
}

export async function saveFile(content: Buffer, description: string): Promise<string> {
  const digest = createHash("sha1").update(content).digest("hex");

  await cmsDb.transaction(async (tx) => {
    const res = await tx.execute(sql`SELECT digest FROM fsobjects WHERE digest = ${digest}`);
    if (res.rows.length > 0) {
      return digest;
    }

    const resOid = await tx.execute(sql`SELECT lo_creat(${INV_WRITE | INV_READ}) AS oid`);
    const oid = resOid.rows[0].oid;

    await tx.execute(sql`SELECT lo_put(${oid}, 0, ${content})`);
    await tx.execute(
      sql`INSERT INTO fsobjects (digest, loid, description) VALUES (${digest}, ${oid}, ${description})`,
    );
  });

  return digest;
}

export async function getTerryFileContent(fileName: string, request?: Request): Promise<Response> {
  const root = path.resolve(process.env.TERRY_FILES_PATH!);
  // Terry paths coming from the database start with "/" (e.g. the statement
  // path), but they must be resolved relative to the files root. `path.resolve`
  // would treat them as absolute and escape the root, so use `path.join`.
  const filePath = path.join(root, fileName);
  if (!filePath.startsWith(root + path.sep)) {
    return new Response(null, { status: 404 });
  }

  const stats = await stat(filePath).catch(() => null);
  if (!stats?.isFile()) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers({
    "Cache-Control": "public, max-age=604800",
    "Last-Modified": stats.mtime.toUTCString(),
  });

  return createRangeStream(fileName, stats.size, request, headers, (start, endExclusive) =>
    createReadStream(filePath, { start, end: endExclusive - 1 }),
  );
}

function createRangeStream(
  fileName: string,
  totalSize: number,
  request: Request | undefined,
  defaultHeaders: Headers,
  createStream: (start: number, endExclusive: number) => Readable,
): Response {
  const headers = new Headers(defaultHeaders);
  headers.set("Accept-Ranges", "bytes");

  const contentType = getContentType(fileName);
  headers.set("Content-Type", contentType);
  if (request && contentType !== "application/pdf") {
    headers.set("Content-Security-Policy", "sandbox");
    headers.set("X-Content-Type-Options", "nosniff");
  }

  const rangeHeader = request?.headers.get("range");
  if (rangeHeader != null) {
    const ranges = parseRange(totalSize, rangeHeader, { combine: true });
    if (ranges === -1) {
      headers.delete("Cache-Control");
      headers.set("Content-Range", `bytes */${totalSize}`);
      return new Response(null, { status: 416, headers });
    }

    if (ranges !== -2 && ranges.length === 1 && ranges.type === "bytes") {
      const range = ranges[0];
      headers.set("Content-Length", String(range.end - range.start + 1));
      headers.set("Content-Range", `bytes ${range.start}-${range.end}/${totalSize}`);
      return new Response(
        Readable.toWeb(createStream(range.start, range.end + 1)) as ReadableStream,
        { status: 206, headers },
      );
    }
  }

  headers.set("Content-Length", String(totalSize));
  return new Response(
    totalSize === 0 ? null : (Readable.toWeb(createStream(0, totalSize)) as ReadableStream),
    { headers },
  );
}

function getContentType(fileName: string): string {
  const language = fileLanguage(fileName);
  if (isBinaryLanguage(language)) {
    return "application/octet-stream";
  }
  if (language) {
    return "text/plain";
  }

  return lookupMime(fileName) ?? "application/octet-stream";
}
