import { type NextRequest, NextResponse } from "next/server";

import { msg } from "@lingui/core/macro";

import { submit } from "~/lib/api/submit";
import { hasPermission } from "~/lib/user";

export async function POST(request: NextRequest) {
  const canSubmit = await hasPermission("task", "submit");
  if (!canSubmit) {
    return NextResponse.json({ error: msg`Non sei autorizzato` });
  }

  const task = request.nextUrl.searchParams.get("task");
  if (!task) return NextResponse.json({ error: msg`Task non trovato` });

  const language = request.nextUrl.searchParams.get("language");
  const fromData = await request.formData();

  return NextResponse.json(await submit(task, language, fromData));
}
