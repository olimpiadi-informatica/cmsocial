import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest, { params }: { params: { legacy: string } }) {
  const searchParams = request.nextUrl.searchParams;
  searchParams.set("category", params.legacy);
  redirect(`/algobadge?${searchParams}`);
}
