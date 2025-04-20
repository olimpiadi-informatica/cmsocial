import { cache } from "react";

import { and, eq, gt, sql } from "drizzle-orm";
import { orderBy } from "lodash-es";

import { cmsDb, terryDb } from "~/lib/db";
import {
  participations,
  socialParticipations,
  socialUsers,
  taskScores,
  tasks,
  users,
} from "~/lib/db/schema";
import { terryTasks, terryUserTasks } from "~/lib/db/schema-terry";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
  score: number;
  role: "newbie" | "trusted" | "admin" | null;
  registrationTime: Date;
  institute: string | null;
};

export const getUser = cache(async (username?: string | null): Promise<User | undefined> => {
  if (!username) return;
  const [user] = await cmsDb
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      image: sql<string>`'https://www.gravatar.com/avatar/' || MD5(${users.email}) || '?d=identicon'`,
      score: socialParticipations.score,
      role: socialUsers.role,
      registrationTime: socialUsers.createdAt,
      institute: socialUsers.institute,
    })
    .from(users)
    .innerJoin(socialUsers, eq(socialUsers.cmsId, users.id))
    .innerJoin(participations, eq(participations.userId, users.id))
    .innerJoin(socialParticipations, eq(socialParticipations.id, participations.id))
    .where(
      and(
        eq(users.username, username),
        eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
      ),
    );
  return user;
});

export type UserScore = {
  name: string;
  terry: boolean;
  title: string;
  score: number;
  maxScore: number;
};

export const getUserScores = cache(
  async (userId: number, username: string): Promise<UserScore[]> => {
    const [training, terry] = await Promise.all([
      getTrainingScores(userId),
      getTerryScores(username),
    ]);

    return orderBy(
      [...training, ...terry],
      [(s) => s.score / s.maxScore, "score", "title"],
      ["desc", "desc", "asc"],
    );
  },
);

function getTrainingScores(userId: number): Promise<UserScore[]> {
  return cmsDb
    .select({
      name: tasks.name,
      title: tasks.title,
      score: taskScores.score,
      maxScore: sql<number>`100`,
      terry: sql<boolean>`FALSE`,
    })
    .from(taskScores)
    .innerJoin(tasks, eq(tasks.id, taskScores.taskId))
    .innerJoin(participations, eq(participations.id, taskScores.participationId))
    .where(
      and(
        eq(participations.userId, userId),
        eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
        eq(tasks.contestId, Number(process.env.CMS_CONTEST_ID)),
        gt(taskScores.score, 0),
      ),
    );
}

function getTerryScores(username: string): Promise<UserScore[]> {
  return terryDb
    .select({
      name: terryTasks.name,
      title: terryTasks.title,
      score: terryUserTasks.score,
      maxScore: terryTasks.maxScore,
      terry: sql<boolean>`TRUE`,
    })
    .from(terryUserTasks)
    .innerJoin(terryTasks, eq(terryTasks.name, terryUserTasks.task))
    .where(and(eq(terryUserTasks.token, username), gt(terryUserTasks.score, 0)));
}

export async function updateUserSchool(userId: number, institute: string) {
  await cmsDb
    .update(socialUsers)
    .set({ institute: institute })
    .where(eq(socialUsers.cmsId, userId));
}
