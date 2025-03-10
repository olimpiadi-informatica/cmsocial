"use client";

import dynamic from "next/dynamic";

export const DateTime = dynamic(() => import("@olinfo/react-components").then((m) => m.DateTime), {
  ssr: false,
});
