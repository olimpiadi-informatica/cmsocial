"use client";

import { Suspense, lazy, useEffect, useState } from "react";

import { useLingui } from "@lingui/react/macro";
import { supportsPDFs } from "pdfobject";

const MobileStatement = lazy(() => import("./mobile-statement"));

export function Statement({ url }: { url: string }) {
  const { t } = useLingui();

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

  return <object title={t`Testo del problema`} data={`${url}#navpanes=0`} className="size-full" />;
}

function LoadingStatement() {
  return <div className="skeleton absolute inset-0 rounded-none" />;
}
