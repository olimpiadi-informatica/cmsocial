import { logger } from "better-auth";
import { and, eq, notExists } from "drizzle-orm";

import type { User } from "~/lib/auth/types";
import { cmsDb } from "~/lib/db";
import { participations, socialUsers, users } from "~/lib/db/schema";

export async function createUser(user: User) {
  const [cmsUser] = await cmsDb
    .insert(users)
    .values({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: "",
      email: user.email,
    })
    .returning({ id: users.id });
  return cmsUser.id;
}

export async function deleteDanglingUser(email: string) {
  const deleted = await cmsDb
    .delete(users)
    .where(
      and(
        eq(users.email, email),
        notExists(cmsDb.select().from(socialUsers).where(eq(socialUsers.cmsId, users.id))),
      ),
    )
    .returning();
  logger.warn(
    `${deleted.length} dangling user(s) deleted: ${deleted.map((u) => u.email).join(", ")}`,
  );
}

export async function deleteUser(email: string) {
  await cmsDb.delete(users).where(eq(users.email, email));
}

export async function createParticipation(user: User) {
  await cmsDb.insert(participations).values({
    contestId: Number(process.env.CMS_CONTEST_ID),
    userId: user.cmsId,
  });
}
