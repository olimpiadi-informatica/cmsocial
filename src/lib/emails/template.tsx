import Head from "next/head";
import type { ReactNode } from "react";

export function Template({ title, children }: { title: string; children: ReactNode }) {
  return (
    <html lang="it">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </Head>
      <body style={{ fontFamily: "sans-serif", fontSize: "16px", padding: "16px" }}>
        <div style={{ fontSize: "1.75em", fontWeight: "bold", textAlign: "center" }}>
          Olimpiadi di Informatica
        </div>
        <div style={{ maxWidth: "576px", margin: "auto" }}>{children}</div>
      </body>
    </html>
  );
}
