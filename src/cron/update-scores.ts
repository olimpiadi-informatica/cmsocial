import { eq, inArray, sql } from "drizzle-orm";
import { chunk, clamp, sumBy } from "lodash-es";

import { cmsDb } from "~/lib/db";
import { socialParticipations, socialTasks, taskScores } from "~/lib/db/schema-cmsocial";
import { outLogger } from "~/lib/logger";

function getScore(s: number): number {
  return s >= 99 ? 1 : s >= 85 ? 0.1 : 0;
}

function computeSmartScore(
  userToTask: Map<number, { tid: number; score: number }[]>,
  taskToUser: Map<number, { uid: number; score: number }[]>,
) {
  const difficulties = new Map(Array.from(taskToUser.keys(), (tid) => [tid, 1]));
  const abilities = new Map(Array.from(userToTask.keys(), (uid) => [uid, 1]));
  const attemptsSqrt = new Map(
    Array.from(taskToUser, ([tid, users]) => [tid, Math.sqrt(users.length)]),
  );

  const userWeight = new Map<number, number>();

  for (let iter = 0; iter < 20; iter++) {
    let totalAbility = 0;
    for (const [uid, tasks] of userToTask) {
      const ability = sumBy(tasks, (t) => t.score * difficulties.get(t.tid)!);
      abilities.set(uid, ability);
      totalAbility += ability;

      const numProblems = tasks.length;
      if (numProblems < 10) {
        userWeight.set(uid, 0);
      } else {
        userWeight.set(uid, Math.log2(2 + 2 * numProblems));
      }
    }

    const avgAbility = totalAbility / userToTask.size;
    for (const [uid, ability] of abilities) {
      abilities.set(uid, Math.max(ability / avgAbility, 0.01));
    }

    for (const [tid, users] of taskToUser) {
      if (users.length === 0) continue;

      const sumScoreOverAbility = sumBy(
        users,
        (u) => (u.score / abilities.get(u.uid)!) * userWeight.get(u.uid)!,
      );
      const totalWeight = sumBy(users, (u) => userWeight.get(u.uid)!);

      if (totalWeight < 1e-5) {
        difficulties.set(tid, 1);
      } else if (sumScoreOverAbility === 0) {
        difficulties.set(tid, 10);
      } else {
        const normalizedSum = sumScoreOverAbility / (totalWeight / users.length);
        difficulties.set(tid, clamp(attemptsSqrt.get(tid)! / normalizedSum, 0.1, 10));
      }
    }
  }

  return difficulties;
}

export async function updateScores() {
  outLogger.info("Updating scores...");

  let taskMultipliers: Map<number, number>;
  try {
    const scores = await cmsDb
      .select({
        uid: taskScores.participationId,
        tid: taskScores.taskId,
        pt: taskScores.score,
      })
      .from(taskScores);
    if (scores.length === 0) return;

    const userToTask = new Map<number, { tid: number; score: number }[]>();
    const taskToUser = new Map<number, { uid: number; score: number }[]>();

    for (const { uid, tid, pt } of scores) {
      if (!userToTask.has(uid)) userToTask.set(uid, []);
      userToTask.get(uid)!.push({ tid, score: getScore(pt) });

      if (!taskToUser.has(tid)) taskToUser.set(tid, []);
      taskToUser.get(tid)!.push({ uid, score: getScore(pt) });
    }

    taskMultipliers = computeSmartScore(userToTask, taskToUser);
  } catch (err) {
    outLogger.error("Failed to compute multipliers", err);
    return;
  }

  outLogger.info("Updating task multipliers...");
  try {
    for (const tasks of chunk([...taskMultipliers.entries()], 1000)) {
      const cases = tasks.map(
        ([tid, multiplier]) =>
          sql`WHEN ${socialTasks.id} = ${tid} THEN ${multiplier}::double precision`,
      );
      await cmsDb
        .update(socialTasks)
        .set({ scoreMultiplier: sql`CASE ${sql.join(cases, sql` `)} END` })
        .where(
          inArray(
            socialTasks.id,
            tasks.map(([tid]) => tid),
          ),
        );
    }
  } catch (err) {
    outLogger.error("Failed to update task multipliers", err);
    return;
  }

  outLogger.info("Updating participation scores...");
  try {
    const totalScore = cmsDb
      .select({
        score: sql`COALESCE(SUM(${taskScores.score} * ${socialTasks.scoreMultiplier}), 0)`,
      })
      .from(taskScores)
      .innerJoin(socialTasks, eq(socialTasks.id, taskScores.taskId))
      .where(eq(taskScores.participationId, socialParticipations.id));
    await cmsDb.update(socialParticipations).set({ score: sql<number>`${totalScore}` });
  } catch (err) {
    outLogger.error("Failed to update participation scores", err);
    return;
  }

  outLogger.info("Scores updated!");
}
