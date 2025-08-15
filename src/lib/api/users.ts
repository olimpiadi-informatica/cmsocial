import { cache } from "react";

import { and, count, desc, eq, gt } from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { participations, socialParticipations, socialUsers, users } from "~/lib/db/schema";

export const getUserCount = cache(async (): Promise<number> => {
  const [res] = await cmsDb
    .select({ count: count() })
    .from(users)
    .innerJoin(participations, eq(participations.userId, users.id))
    .where(
      and(
        eq(participations.hidden, false),
        eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
        gt(socialParticipations.score, 0),
      ),
    );
  return res.count;
});

export type User = {
  id: number;
  username: string;
  name: string;
  score: number;
  image: string;
};

export const getRanking = cache((page: number, pageSize: number): Promise<User[]> => {
  if (pageSize > 100) {
    throw new Error("pageSize must be less than or equal to 100");
  }

  return cmsDb
    .select({
      id: users.id,
      username: users.username,
      name: socialUsers.name,
      score: socialParticipations.score,
      image: socialUsers.image,
    })
    .from(users)
    .innerJoin(socialUsers, eq(socialUsers.cmsId, users.id))
    .innerJoin(participations, eq(participations.userId, users.id))
    .innerJoin(socialParticipations, eq(socialParticipations.id, participations.id))
    .where(
      and(
        eq(participations.hidden, false),
        eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
        gt(socialParticipations.score, 0),
      ),
    )
    .orderBy(desc(socialParticipations.score))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
});
