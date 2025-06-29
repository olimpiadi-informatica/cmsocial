import z, { type ZodType } from "zod";

import { createLegacyToken } from "~/lib/auth/legacy-cookie";
import { getSessionUser } from "~/lib/user";

const alertSchema = z.object({
  message: z.string(),
  severity: z.enum(["warning", "danger", "success"]),
});

const uploadedFileSchema = z.object({
  id: z.string().uuid(),
  validation: z.object({
    alerts: z.array(alertSchema),
  }),
});

export function uploadSource(id: string, files: FormData) {
  files.set("input_id", id);
  return legacyApiJson("upload_source", files, uploadedFileSchema);
}

export function uploadOutput(id: string, files: FormData) {
  files.set("input_id", id);
  return legacyApiJson("upload_output", files, uploadedFileSchema);
}

export async function submit(inputId: string, sourceId: string, outputId: string) {
  const data = new FormData();
  data.set("input_id", inputId);
  data.set("source_id", sourceId);
  data.set("output_id", outputId);

  const submission = await legacyApiJson("submit", data, z.object({ id: z.string().uuid() }));
  return submission.id;
}

export async function generateInput(token: string, task: string) {
  const data = new FormData();
  data.set("token", token);
  data.set("task", task);

  await legacyApi("generate_input", data);
}

export async function abandonInput(token: string, id: string) {
  const data = new FormData();
  data.set("token", token);
  data.set("input_id", id);

  await legacyApi("abandon_input", data);
}

async function legacyApi(endpoint: string, body: FormData): Promise<Response> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const resp = await fetch(`https://territoriali.olinfo.it/api/${endpoint}`, {
    method: "POST",
    headers: {
      cookie: `training_token=${await createLegacyToken(user, "1 minute")}`,
    },
    body,
  });
  if (!resp.ok) {
    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
  }
  return resp;
}

async function legacyApiJson<T>(
  endpoint: string,
  body: FormData,
  schema: ZodType<T, any, any>,
): Promise<T> {
  const resp = await legacyApi(endpoint, body);
  return schema.parse(await resp.json());
}
