import type { BetterAuthOptions } from "better-auth";
import { z } from "zod";

export const userExtraFields: NonNullable<BetterAuthOptions["user"]>["additionalFields"] = {
  cmsId: {
    type: "number",
    input: false,
  },
  firstName: {
    type: "string",
    required: true,
    validator: {
      input: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(/^[\p{L}\s'-]+$/u),
    },
  },
  lastName: {
    type: "string",
    required: true,
    validator: {
      input: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(/^[\p{L}\s'-]+$/u),
    },
  },
  institute: {
    type: "string",
    required: false,
    validator: {
      input: z.string().min(2).max(50).regex(/^\w+$/),
    },
  },
};
