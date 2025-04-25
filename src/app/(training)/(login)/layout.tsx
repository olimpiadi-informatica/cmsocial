import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";

import { LoginTabs } from "./tabs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <LoginTabs />
      <ViewTransition>{children}</ViewTransition>
    </div>
  );
}
