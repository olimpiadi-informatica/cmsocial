"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Routing() {
  const router = useRouter();

  // Legacy hash routing
  useEffect(() => {
    if (window.location.hash) {
      router.replace(window.location.hash.slice(1));
    }
  }, [router]);

  return null;
}
