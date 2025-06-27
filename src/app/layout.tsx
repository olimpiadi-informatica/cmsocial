import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Layout } from "@olinfo/react-components";

import { loadLocale } from "~/lib/locale";

import { Routing } from "./routing";
import "./globals.css";

import { LayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "Allenamento Olimpiadi Italiane di Informatica",
  description: "Piattaforma di allenamento delle Olimpiadi Italiane di Informatica",
  metadataBase: new URL("https://training.olinfo.it"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e2df" },
    { media: "(prefers-color-scheme: dark)", color: "#151a1f" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const i18n = await loadLocale();

  return (
    <html lang={i18n.locale}>
      <body>
        <Layout>
          <LayoutClient locale={i18n.locale} messages={i18n.messages}>
            {children}
          </LayoutClient>
        </Layout>
        <Routing />
        {process.env.GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  );
}
