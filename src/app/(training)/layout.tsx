import type { ReactNode } from "react";

import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { PushPrompt } from "./(push)/push-prompt";
import { LayoutClient } from "./layout-client";
import { Navbar } from "./navbar";

export default async function Layout({ children }: { children: ReactNode }) {
  await loadLocale();
  const user = await getSessionUser();

  return (
    <>
      <Navbar />
      <LayoutClient>{children}</LayoutClient>
      {user && <PushPrompt applicationServerKey={process.env.VAPID_PUBLIC_KEY} />}
    </>
  );
}
