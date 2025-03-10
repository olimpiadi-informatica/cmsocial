import path from "node:path";

import { getTerryFileContent } from "~/lib/api/file";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const filePath = path.join(...(await params).path);
  return getTerryFileContent(filePath);
}
