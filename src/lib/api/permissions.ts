import { eq } from "drizzle-orm";
import { cache } from "react";

import { cmsDb } from "~/lib/db";
import { socialUsers } from "~/lib/db/schema-cmsocial";
import { AccessLevel } from "~/lib/permissions";

export const getAccessLevel = cache(async (userId?: number): Promise<AccessLevel> => {
  if (!userId) return AccessLevel.None;

  const [user] = await cmsDb
    .select({ accessLevel: socialUsers.accessLevel })
    .from(socialUsers)
    .where(eq(socialUsers.id, userId));

  return user?.accessLevel ?? AccessLevel.None;
});
