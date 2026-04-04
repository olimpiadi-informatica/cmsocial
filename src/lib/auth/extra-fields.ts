import type { BetterAuthDBOptions } from "better-auth";
import z from "zod";

export const userExtraFields = {
  cmsId: {
    type: "number",
    required: false,
  },
  institute: {
    type: "string",
    required: false,
    validator: {
      input: z.string().min(2).max(50).regex(/^\w+$/),
    },
  },
  registrationStep: {
    type: "number",
    required: false,
  },
} as const satisfies BetterAuthDBOptions<"user">["additionalFields"];
