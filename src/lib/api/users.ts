import { cache } from "react";

import { and, count, desc, eq, sql } from "drizzle-orm";

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
      ),
    );
  return res.count;
});

export type User = {
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
      username: users.username,
      name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      score: socialParticipations.score,
      image: sql<string>`'https://www.gravatar.com/avatar/' || MD5(${users.email}) || '?d=identicon'`,
    })
    .from(users)
    .innerJoin(socialUsers, eq(socialUsers.id, users.id))
    .innerJoin(participations, eq(participations.userId, users.id))
    .innerJoin(socialParticipations, eq(socialParticipations.id, participations.id))
    .where(
      and(
        eq(participations.hidden, false),
        eq(participations.contestId, Number(process.env.CMS_CONTEST_ID)),
      ),
    )
    .orderBy(desc(socialParticipations.score))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
});
