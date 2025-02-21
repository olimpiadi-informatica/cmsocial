import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Layout } from "@olinfo/react-components";
import { getContest } from "@olinfo/training-api";

import { loadLocale } from "~/lib/locale";

import { Routing } from "./routing";
import "./globals.css";
import { LayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "Allenamento Olimpiadi Italiane di Informatica",
  description: "Piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e2df" },
    { media: "(prefers-color-scheme: dark)", color: "#151a1f" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [i18n, contest] = await Promise.all([loadLocale(), getContest()]);

  return (
    <html lang={i18n.locale}>
      <body>
        <Layout>
          <LayoutClient locale={i18n.locale} messages={i18n.messages}>
            {children}
          </LayoutClient>
        </Layout>
        <Routing />
        {contest && <GoogleAnalytics gaId={contest.analytics} />}
      </body>
    </html>
  );
}
