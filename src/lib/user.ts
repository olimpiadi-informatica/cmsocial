import { cookies } from "next/headers";

import { getMe, getMeSync } from "@olinfo/training-api";

export async function getSessionUser() {
  const token = (await cookies()).get("training_token")?.value;
  if (!token) return null;
  const me = getMeSync(token);
  if (me.username !== (await getMe())?.username) return null;
  return me;
}
