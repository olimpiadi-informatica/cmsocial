import { notFound } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import { Menu } from "@olinfo/react-components";

import { H1 } from "~/components/header";
import { Link } from "~/components/link";
import { OutcomeScore } from "~/components/outcome";
import { getQuizmsContests } from "~/lib/api/quizms";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  await loadLocale();
  const user = await getSessionUser();

  let contests: Awaited<ReturnType<typeof getQuizmsContests>>;
  switch (category) {
    case "primarie":
    case "secondarie":
      contests = (await getQuizmsContests(user?.id, `fibonacci-${category}`)).toReversed();
      break;
    case "corso":
      contests = await getQuizmsContests(user?.id, `fibonacci-${category}`);
      break;
    default:
      notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1 className="px-2">
          {category === "primarie" && <Trans>Giochi di Fibonacci - Scuole primarie</Trans>}
          {category === "secondarie" && <Trans>Giochi di Fibonacci - Scuole secondarie</Trans>}
          {category === "corso" && <Trans>Giochi di Fibonacci - Corso di programmazione</Trans>}
        </H1>
      </div>
      <Menu>
        {contests.map((contest) => (
          <li key={contest.id}>
            <Link href={`/quizms/${contest.id}/`} className="grid-cols-[1fr_auto]">
              <div>{contest.name}</div>
              {contest.ended === false && (
                <span className="inline-block rounded-lg px-2 text-sm bg-yellow-400 text-warning-content">
                  <Trans>in corso...</Trans>
                </span>
              )}
              {contest.ended && contest.score != null && contest.maxScore != null && (
                <OutcomeScore score={contest.score} maxScore={contest.maxScore} />
              )}
            </Link>
          </li>
        ))}
      </Menu>
    </div>
  );
}
