import { getFileContent } from "~/lib/api/file";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ digest: string; name: string }> },
) {
  return getFileContent(await params, request);
}
