import type { ReactNode } from "react";

import { loadLocale } from "~/lib/locale";

import { LayoutClient } from "./layout-client";
import { Navbar } from "./navbar";

export default async function Layout({ children }: { children: ReactNode }) {
  await loadLocale();

  return (
    <>
      <Navbar />
      <LayoutClient>{children}</LayoutClient>
    </>
  );
}
