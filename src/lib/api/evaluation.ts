import { randomUUID } from "node:crypto";
import { createConnection } from "node:net";
import * as readline from "node:readline";

import z from "zod";

import { outLogger } from "~/lib/logger";

let client = createClient();
const submissions = new Map<string, [() => void, (err: Error) => void]>();

const resultSchema = z.strictObject({
  __data: z.null(),
  __error: z.string().nullable(),
  __id: z.string(),
});

export function sendSubmission(submissionId: number) {
  if (!client?.writable) {
    throw new Error("EvaluationService connection is not writable");
  }

  const id = randomUUID();
  const request = {
    __method: "new_submission",
    __data: { submission_id: submissionId },
    __id: id,
  };
  client.write(`${JSON.stringify(request)}\r\n`);

  const { promise, resolve, reject } = Promise.withResolvers<void>();
  submissions.set(id, [resolve, reject]);
  return promise;
}

function createClient() {
  if (!process.env.EVALUATION_SERVICE_HOST || !process.env.EVALUATION_SERVICE_PORT) {
    return null;
  }

  const client = createConnection({
    host: process.env.EVALUATION_SERVICE_HOST,
    port: Number(process.env.EVALUATION_SERVICE_PORT),
  });

  const rl = readline.createInterface({ input: client });

  rl.on("line", (data) => {
    try {
      const { __id: id, __error: error } = resultSchema.parse(JSON.parse(data));
      const callbacks = submissions.get(id);
      if (error) {
        callbacks?.[1]?.(new Error(error));
      } else {
        callbacks?.[0]?.();
      }
      submissions.delete(id);
    } catch (err) {
      outLogger.error("Error parsing evaluation service response", err);
    }
  });

  client.on("end", () => reconnect(new Error("Connection closed")));
  client.on("error", (err) => reconnect(err));

  return client;
}

function reconnect(err: Error) {
  outLogger.error("EvaluationService disconnected", err);

  for (const [, [, reject]] of submissions) {
    reject(err);
  }
  submissions.clear();

  setTimeout(() => {
    client = createClient();
  }, 5_000);
}
