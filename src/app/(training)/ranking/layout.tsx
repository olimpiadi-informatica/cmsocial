import type { ReactNode } from "react";

import { loadLocale } from "~/lib/locale";

import { RankingTabs } from "./tabs";

export default async function Layout({ children }: { children: ReactNode }) {
  await loadLocale();

  return (
    <div className="flex flex-col gap-4">
      <RankingTabs />
      {children}
    </div>
  );
}
