import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSessionUser } from "~/lib/user";

export const metadata: Metadata = {
  title: "Training - Recupero password",
};

export default async function Layout({ children }: { children: ReactNode }) {
  if (await getSessionUser()) {
    return redirect("/");
  }

  return children;
}
