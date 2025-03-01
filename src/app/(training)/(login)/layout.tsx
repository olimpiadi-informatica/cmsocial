import type { ReactNode } from "react";

import { LoginTabs } from "./tabs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <LoginTabs />
      {children}
    </div>
  );
}
