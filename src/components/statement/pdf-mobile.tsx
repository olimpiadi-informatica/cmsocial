import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import { range } from "es-toolkit";
import { Document, Page, pdfjs, useDocumentContext } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).href;

// pdf.js starts a full `fetch` of the whole document when streaming is enabled.
// That download saturates the connection and starves the range requests needed to
// render the first pages, so on slow connections pages stay blank until the whole
// file has been downloaded. Disabling streaming forces pdf.js to fetch only the
// ranges it needs, and disabling auto-fetch avoids downloading the rest in the
// background.
const pdfOptions = {
  rangeChunkSize: 1 << 20,
  disableStream: true,
  disableAutoFetch: true,
};

export default function PdfMobileStatement({
  url,
  fallback,
}: {
  url?: string;
  fallback: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth - 16);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);

    function onResize() {
      setWidth(ref.current!.clientWidth - 16);
    }
  }, []);

  return (
    <div className="size-full overflow-y-auto" ref={ref}>
      <Document
        file={url}
        noData={fallback}
        loading={fallback}
        options={pdfOptions}
        className="grid gap-4 bg-zinc-500 p-2">
        <Pages width={width} />
      </Document>
    </div>
  );
}

function Pages({ width }: { width: number | undefined }) {
  const document = useDocumentContext();
  const pdf = document?.pdf;
  if (!width || !pdf) return;

  return range(pdf.numPages).map((i) => <Page key={i} pageNumber={i + 1} width={width} />);
}
