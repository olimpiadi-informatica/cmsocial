import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDiario, getPosts } from "~/lib/diari";

import DiaryBookView from "./book";
import "katex/dist/katex.css";

type Props = {
  params: Promise<{
    contest: string;
    year: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contest, year } = await params;
  const diario = getDiario(contest, year);

  if (!diario) {
    return {
      title: "Diario non trovato",
    };
  }

  const contestTitle = diario.name || contest.toUpperCase();
  const location = diario.city ? ` a ${diario.city}` : "";

  return {
    title: `Diario ${contestTitle} ${year}${location} | Diari Olimpici`,
    description: `Raccolta dei post e racconti del diario per ${contestTitle} ${year}${location}.`,
    openGraph: {
      title: `Diario ${contestTitle} ${year}${location}`,
      description: `Raccolta dei post e racconti del diario per ${contestTitle} ${year}${location}.`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { contest, year } = await params;
  const diario = getDiario(contest, year);

  if (!diario) {
    notFound();
  }

  const postsData = getPosts(diario.topicId, diario.postIds);

  return <DiaryBookView contest={contest} year={year} diario={diario} postsData={postsData} />;
}
