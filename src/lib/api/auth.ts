import { eq } from "drizzle-orm";

import { RegistrationStep } from "~/lib/auth/types";
import { cmsDb, terryDb } from "~/lib/db";
import { participations, socialUsers, users } from "~/lib/db/schema";
import {
  terryInputs,
  terryIps,
  terrySubmissions,
  terryUsers,
  terryUserTasks,
} from "~/lib/db/schema-terry";

export async function finalizeRegistration(
  userId: string,
  username: string,
  firstName: string,
  lastName: string,
) {
  await cmsDb.transaction(async (tx) => {
    const [cmsUser] = await tx
      .insert(users)
      .values({
        username,
        firstName,
        lastName,
        password: "",
      })
      .returning({ id: users.id });
    const cmsId = cmsUser.id;

    await tx.insert(participations).values({
      contestId: Number(process.env.CMS_CONTEST_ID),
      userId: cmsId,
    });

    await tx
      .update(socialUsers)
      .set({
        cmsId,
        role: "newbie",
        registrationStep: RegistrationStep.School,
      })
      .where(eq(socialUsers.id, userId));
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

export async function deleteUser(cmsId: number) {
  await cmsDb.delete(users).where(eq(users.id, cmsId));
}

export async function deleteTerryUser(username: string) {
  await terryDb.transaction(async (tx) => {
    await tx.delete(terrySubmissions).where(eq(terrySubmissions.token, username));
    await tx.delete(terryUserTasks).where(eq(terryUserTasks.token, username));
    await tx.delete(terryInputs).where(eq(terryInputs.token, username));
    await tx.delete(terryIps).where(eq(terryIps.token, username));
    await tx.delete(terryUsers).where(eq(terryUsers.token, username));
  });
}
