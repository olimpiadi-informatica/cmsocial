import { getMeSync } from "@olinfo/training-api";
import { cookies } from "next/headers";

export function getSessionUser() {
  const token = cookies().get("training_token")?.value;
  if (!token) return null;
  return getMeSync(token);
}
