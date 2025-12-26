import { msg } from "@lingui/core/macro";

import type { submit } from "~/lib/api/submit";

export async function submitAction(taskName: string, language: string | null, files: FormData) {
  const params = new URLSearchParams();
  params.append("task", taskName);
  if (language) params.append("language", language);

  const resp = await fetch(`/files/submit?${params}`, {
    method: "POST",
    body: files,
  });
  if (!resp.ok) throw { error: msg`Errore sconosciuto` };

  return resp.json() as ReturnType<typeof submit>;
}
