import { PDFParse } from "pdf-parse";

import { getFileContent } from "~/lib/api/file";
import { getTaskStatement } from "~/lib/api/task";

PDFParse.setWorker(new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).href);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskName: string }> },
) {
  const { taskName } = await params;

  const file = await getTaskStatement(taskName, "it");
  const content = await getFileContent(file!);
  const buffer = await content.arrayBuffer();

  const parser = new PDFParse({ data: buffer });
  const result = await parser.getScreenshot({ first: 1 });
  return new Response(new Uint8Array(result.pages[0].data), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
