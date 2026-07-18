import { type ReactNode, Suspense } from "react";

import { getSessionUser } from "~/lib/user";

import { AcceptGuidelinesButton } from "./accept-button";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="prose max-w-full my-4">
      {children}
      {user && (
        <Suspense>
          <div className="not-prose flex justify-center">
            <AcceptGuidelinesButton accepted={!!user.guidelinesAcceptedAt} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
