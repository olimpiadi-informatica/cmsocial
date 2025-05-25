import { eq } from "drizzle-orm";
import { cmsDb } from "~/lib/db";
import { participations, users } from "~/lib/db/schema";
import type { User } from "~/lib/user";

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

export async function deleteUser(email: string) {
  await cmsDb.delete(users).where(eq(users.email, email));
}

export async function createParticipation(user: User) {
  await cmsDb.insert(participations).values({
    contestId: Number(process.env.CMS_CONTEST_ID),
    userId: user.cmsId,
  });
}
