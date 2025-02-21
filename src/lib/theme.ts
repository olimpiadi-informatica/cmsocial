import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(media.matches ? "dark" : "light");

    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);

    function updateTheme(e: MediaQueryListEvent) {
      setTheme(e.matches ? "dark" : "light");
    }
  }, []);

  return theme;
}
