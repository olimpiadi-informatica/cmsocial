import { cookies } from "next/headers";
import { cache } from "react";

import { getMe, getMeSync } from "@olinfo/training-api";

export const getSessionUser = cache(async () => {
  try {
    const token = (await cookies()).get("training_token")?.value;
    if (!token) return null;

    const meSync = getMeSync(token);
    const me = await getMe();

    if (meSync.username !== me?.username) return null;
    return meSync;
  } catch (e) {
    console.error(e);
    return null;
  }
});
