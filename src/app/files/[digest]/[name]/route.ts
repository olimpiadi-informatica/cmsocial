import { getFileContent } from "~/lib/api/file";

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ digest: string; name: string }> },
) {
  return getFileContent(await params);
}
