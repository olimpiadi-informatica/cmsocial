"use client";

import { Suspense, lazy, useEffect, useState } from "react";

import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { supportsPDFs } from "pdfobject";

const MobileStatement = lazy(() => import("./mobile-statement"));

export function Statement({ url, title }: { url: string; title: string }) {
  const { _ } = useLingui();

  const [isMobile, setMobile] = useState<boolean>();
  useEffect(() => setMobile(!supportsPDFs), []);

  if (isMobile === undefined) {
    return <LoadingStatement />;
  }

  if (isMobile) {
    return (
      <Suspense fallback={<LoadingStatement />}>
        <MobileStatement url={url} fallback={<LoadingStatement />} />
      </Suspense>
    );
  }

  return (
    <object title={_(msg`Testo di ${title}`)} data={`${url}#navpanes=0`} className="size-full" />
  );
}

function LoadingStatement() {
  return <div className="skeleton absolute inset-0 rounded-none" />;
}
