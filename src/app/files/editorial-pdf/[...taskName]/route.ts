import { getEditorialPdfUrl } from "~/lib/editorials";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskName: string[] }> },
) {
  const { taskName: taskSegments } = await params;
  if (!taskSegments || taskSegments.length === 0) {
    return new Response(null, { status: 404 });
  }

  const isTerry = taskSegments[0] === "terry";
  const taskName = isTerry ? taskSegments.slice(1).join("/") : taskSegments.join("/");

  const url = await getEditorialPdfUrl(taskName, isTerry);
  if (!url) {
    return new Response(null, { status: 404 });
  }

  const pdfRes = await fetch(url);
  if (!pdfRes.ok || !pdfRes.body) {
    return new Response(null, { status: pdfRes.status });
  }

  return new Response(pdfRes.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=604800, s-maxage=604800",
    },
  });
}
