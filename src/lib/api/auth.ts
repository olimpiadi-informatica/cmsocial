import { eq } from "drizzle-orm";

import type { RegistrationStep } from "~/lib/auth/types";
import { cmsDb, terryDb } from "~/lib/db";
import { participations, socialUsers, users } from "~/lib/db/schema";
import {
  terryInputs,
  terryIps,
  terrySubmissions,
  terryUsers,
  terryUserTasks,
} from "~/lib/db/schema-terry";

export async function createUser(username: string, firstName: string, lastName: string) {
  const [cmsUser] = await cmsDb
    .insert(users)
    .values({
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: "",
    })
    .returning({ id: users.id });
  return cmsUser.id;
}

export async function createParticipation(userCmsId: number) {
  await cmsDb.insert(participations).values({
    contestId: Number(process.env.CMS_CONTEST_ID),
    userId: userCmsId,
  });
}

export async function getRegistrationStep(userId: string) {
  const [user] = await cmsDb
    .select({ registrationStep: socialUsers.registrationStep })
    .from(socialUsers)
    .where(eq(socialUsers.id, userId));
  return user.registrationStep as RegistrationStep;
}

export async function updateName(
  cmsId: number,
  firstName: string | undefined,
  lastName: string | undefined,
) {
  await cmsDb.update(users).set({ firstName, lastName }).where(eq(users.id, cmsId));
}

export async function updateRole(userId: string, role: "unverified" | "newbie" | "trusted") {
  await cmsDb.update(socialUsers).set({ role }).where(eq(socialUsers.id, userId));
}

export async function deleteUser(cmsId: number) {
  await cmsDb.delete(users).where(eq(users.id, cmsId));
}

export async function deleteTerryUser(username: string) {
  await terryDb.delete(terryIps).where(eq(terryIps.token, username));
  await terryDb.delete(terryInputs).where(eq(terryInputs.token, username));
  await terryDb.delete(terrySubmissions).where(eq(terrySubmissions.token, username));
  await terryDb.delete(terryUserTasks).where(eq(terryUserTasks.token, username));
  await terryDb.delete(terryUsers).where(eq(terryUsers.token, username));
}
