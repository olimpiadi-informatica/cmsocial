import type { BetterAuthOptions } from "better-auth";
import z from "zod";

export const userExtraFields: NonNullable<BetterAuthOptions["user"]>["additionalFields"] = {
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
    type: "string",
    required: false,
  },
};
