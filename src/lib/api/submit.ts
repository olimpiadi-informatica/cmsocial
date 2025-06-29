import { isString } from "lodash-es";

import { createLegacyToken } from "~/lib/auth/legacy-cookie";
import { getSessionUser } from "~/lib/user";

export async function submitTask(
  taskName: string,
  language: string | undefined,
  files: FormData,
): Promise<number> {
  const encodedFiles: Record<string, { data: string; language?: string }> = {};
  for (const [fileName, file] of files) {
    const buffer = isString(file) ? Buffer.from(file) : Buffer.from(await file.arrayBuffer());
    encodedFiles[fileName] = {
      data: buffer.toString("base64"),
      language,
    };
  }

  const submission = await legacyApi("submission", {
    action: "new",
    task_name: taskName,
    files: encodedFiles,
  });
  return submission.id;
}

async function legacyApi(endpoint: string, body: object) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const resp = await fetch(`https://training.olinfo.it/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `training_token=${await createLegacyToken(user, "1 minute")}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  const data = await resp.json();
  if (data.success === 0) {
    throw new Error(data.error);
  }
  return data;
}
