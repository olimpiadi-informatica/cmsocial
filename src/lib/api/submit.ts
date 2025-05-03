import { isString } from "lodash-es";
import { cookies } from "next/headers";

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
  const token = (await cookies()).get("training_token");

  const resp = await fetch(`https://training.olinfo.it/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `training_token=${token?.value}`,
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
