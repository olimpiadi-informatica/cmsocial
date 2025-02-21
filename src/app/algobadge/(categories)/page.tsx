import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getScores as getTerryScores } from "@olinfo/terry-api";
import { getMe, getUser } from "@olinfo/training-api";

import { Fireworks } from "~/components/fireworks";
import { Badge, type CategoryId, algobadge, getUserBadges } from "~/lib/algobadge";
import { loadLocale } from "~/lib/locale";

import { resources } from "./_resources";
import Home from "./_resources/home.mdx";
import { Header } from "./header";
import { Navbar } from "./navbar";
import { Tree } from "./tree";

type Props = {
  searchParams: {
    category: string;
    impersonate: string;
    unlock?: string;
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const i18n = await loadLocale();

  const category = searchParams.category as CategoryId;
  const title =
    category in algobadge ? `AlgoBadge - ${i18n._(algobadge[category].title)}` : "AlgoBadge";

  return {
    title,
    description:
      "AlgoBadge è un percorso di allenamento che ti consentirà di apprendere gli algoritmi e le tecniche essenziali per affrontare le fase Nazione delle Olimpiadi di Informatica",
  };
}

export default async function Page({ searchParams }: Props) {
  await loadLocale();

  const category = searchParams.category as CategoryId;
  if (category && !(category in resources)) notFound();
  const Resources = resources[category];

  const username = searchParams.impersonate ?? (await getMe())?.username;

  const [trainingScores, terryScores] = await Promise.all([
    username ? getUser(username) : undefined,
    username ? getTerryScores(username) : undefined,
  ]);

  const { badges, totalBadge } = getUserBadges(trainingScores, terryScores, !!searchParams.unlock);

  return (
    <>
      <Navbar badge={totalBadge} />
      <div className="relative mx-auto w-full max-w-screen-xl p-4 pb-8">
        <Tree badges={badges} searchParams={new URLSearchParams(searchParams)} />
        <div className="prose mt-8 max-w-full md:prose-lg">
          {category && <Header category={algobadge[category]} badge={badges[category]} />}
          <div className="[&_svg]:inline-block [&_svg]:align-text-top [&_svg]:me-1">
            {Resources ? <Resources /> : <Home />}
          </div>
        </div>
        {totalBadge === Badge.Diamond && <Fireworks />}
      </div>
    </>
  );
}
