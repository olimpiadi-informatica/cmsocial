import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getMe } from "@olinfo/training-api";

export const metadata: Metadata = {
  title: "Training - Recupero password",
};

export default async function Layout({ children }: { children: ReactNode }) {
  if (await getMe()) {
    return redirect("/");
  }

  return children;
}
