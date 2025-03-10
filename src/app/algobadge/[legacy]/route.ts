import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ legacy: string }> },
) {
  const { legacy } = await params;
  const searchParams = request.nextUrl.searchParams;
  searchParams.set("category", legacy);
  redirect(`/algobadge?${searchParams}`);
}
