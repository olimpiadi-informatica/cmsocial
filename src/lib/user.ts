import { cookies } from "next/headers";

import { getMeSync } from "@olinfo/training-api";

export async function getSessionUser() {
  const token = (await cookies()).get("training_token")?.value;
  if (!token) return null;
  return getMeSync(token);
}
