import { msg } from "@lingui/core/macro";
import { eq, inArray, sql } from "drizzle-orm";

import { RegistrationStep } from "~/lib/auth/types";
import { cmsDb, terryDb } from "~/lib/db";
import { participations, socialUsers, users } from "~/lib/db/schema";
import {
  terryInputs,
  terryIps,
  terryOutputs,
  terrySources,
  terrySubmissions,
  terryUsers,
  terryUserTasks,
} from "~/lib/db/schema-terry";

const USERNAME_REGEX = /^[\w.]{3,39}$/;
const NAME_REGEX = /^[\p{L}\s'-]{3,32}$/u;

export function checkUsername(username: string | undefined) {
  if (!username || !USERNAME_REGEX.test(username)) return msg`Username non valido`;
}

export function checkName(firstName: string | undefined, lastName: string | undefined) {
  if (!firstName || !NAME_REGEX.test(firstName)) return msg`Nome non valido`;
  if (!lastName || !NAME_REGEX.test(lastName)) return msg`Cognome non valido`;
}

export async function getUsernameVariants(username: string) {
  const users = await cmsDb
    .select({ username: socialUsers.username })
    .from(socialUsers)
    .where(eq(sql`LOWER(${socialUsers.username})`, username.toLowerCase()));
  return users.map((u) => u.username);
}

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

    const userInputs = tx
      .select({ id: terryInputs.id })
      .from(terryInputs)
      .where(eq(terryInputs.token, username));
    await tx.delete(terrySources).where(inArray(terrySources.input, userInputs));
    await tx.delete(terryOutputs).where(inArray(terryOutputs.input, userInputs));

    await tx.delete(terryInputs).where(eq(terryInputs.token, username));
    await tx.delete(terryUserTasks).where(eq(terryUserTasks.token, username));
    await tx.delete(terryIps).where(eq(terryIps.token, username));
    await tx.delete(terryUsers).where(eq(terryUsers.token, username));
  });
}
