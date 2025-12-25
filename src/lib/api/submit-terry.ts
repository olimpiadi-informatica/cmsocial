import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import z, { type ZodType } from "zod";

import { createLegacyToken } from "~/lib/auth/legacy-cookie";
import { logger } from "~/lib/logger";
import { getSessionUser } from "~/lib/user";

const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

const alertSchema = z.object({
  message: z.string(),
  severity: z.enum(["warning", "danger", "success"]),
});

const uploadedFileSchema = z.object({
  id: z.guid(),
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

  const submission = await legacyApiJson("submit", data, z.object({ id: z.guid() }));
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

export class TerryApiError extends Error {
  constructor(public readonly description: MessageDescriptor) {
    super(description.id);
  }
}

async function legacyApi(endpoint: string, body: FormData): Promise<Response> {
  const user = await getSessionUser();
  if (!user) {
    throw new TerryApiError(msg`Utente non autenticato`);
  }

  const resp = await fetch(`https://territoriali.olinfo.it/api/${endpoint}`, {
    method: "POST",
    headers: {
      cookie: `training_token=${await createLegacyToken(user, "1 minute")}`,
    },
    body,
  });
  if (!resp.ok) {
    const { code, message } = errorSchema.parse(await resp.json());
    parseError(code, message);
  }
  return resp;
}

async function legacyApiJson<T>(endpoint: string, body: FormData, schema: ZodType<T>): Promise<T> {
  const resp = await legacyApi(endpoint, body);
  return schema.parse(await resp.json());
}

function parseError(code: string, message: string): never {
  switch (message) {
    case "The input file has expired":
      throw new TerryApiError(msg`Input scaduto`);
    case "This input has already been submitted":
      throw new TerryApiError(msg`Generare nuovo input`);
    case "You already have a ready input!":
      throw new TerryApiError(msg`Input già generato`);
    default:
      logger.error("Unknown terry error", { code, message });
      throw new TerryApiError(msg`Errore sconosciuto`);
  }
}
