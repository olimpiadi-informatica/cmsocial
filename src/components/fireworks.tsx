"use client";

import { Suspense, lazy, useEffect, useRef } from "react";

import type { FireworksHandlers } from "@fireworks-js/react";

const BaseFireworks = lazy(() => import("@fireworks-js/react"));

export function Fireworks() {
  const ref = useRef<FireworksHandlers | null>(null);
  useEffect(() => {
    const id = setTimeout(() => ref.current?.waitStop(), 5000);
    return () => clearTimeout(id);
  }, []);

  return (
    <Suspense>
      <BaseFireworks ref={ref} className="fixed inset-0 -z-10" />
    </Suspense>
  );
}
