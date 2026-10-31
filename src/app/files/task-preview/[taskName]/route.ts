import { definePDFJSModule, renderPageAsImage } from "unpdf";

import { type File, getFileContent } from "~/lib/api/file";
import { getTaskStatement } from "~/lib/api/task";

// Use the same pdf.js version as the client (react-pdf) instead of the build
// bundled with unpdf. In Node.js the legacy build must be used. The import is
// kept at runtime so the worker file stays next to the module in node_modules.
definePDFJSModule(() => import(/* turbopackIgnore: true */ "pdfjs-dist/legacy/build/pdf.mjs"));

const CACHE_SIZE = 8;

const previewCache = new Map<string, Promise<Uint8Array<ArrayBuffer>>>();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskName: string }> },
) {
  const { taskName } = await params;

  const statement = await getTaskStatement(taskName, "it");
  if (!statement) {
    return new Response(null, { status: 404 });
  }

  const preview = await getPreview(statement);
  return new Response(preview, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(preview.length),
      "Cache-Control": "public, max-age=1209600, immutable",
    },
  });
}

function getPreview(statement: File): Promise<Uint8Array<ArrayBuffer>> {
  const digest = statement.digest;

  const cached = previewCache.get(digest);
  if (cached) {
    // Refresh the entry position, so that it is evicted last.
    previewCache.delete(digest);
    previewCache.set(digest, cached);
    return cached;
  }

  const preview = renderPreview(statement).catch((e) => {
    previewCache.delete(digest);
    throw e;
  });
  if (previewCache.size >= CACHE_SIZE) {
    const oldest = previewCache.keys().next().value;
    if (oldest != null) previewCache.delete(oldest);
  }
  previewCache.set(digest, preview);

  return preview;
}

async function renderPreview(statement: File): Promise<Uint8Array<ArrayBuffer>> {
  const response = await getFileContent(statement);
  if (!response.ok) {
    throw new Error(`Statement ${statement.digest} not found`);
  }

  const buffer = await response.arrayBuffer();
  const image = await renderPageAsImage(new Uint8Array(buffer), 1, {
    canvasImport: () => import("@napi-rs/canvas"),
    format: "jpeg",
  });

  return image as Uint8Array<ArrayBuffer>;
}
