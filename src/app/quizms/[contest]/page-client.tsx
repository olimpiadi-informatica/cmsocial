"use client";

import { useEffect, useRef } from "react";

import { logout, processQuizmsMessage } from "./actions";
import { quizmsInMessageSchema } from "./utils";

export function PageClient({ contest, quizmsUrl }: { contest: string; quizmsUrl: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  const title = contest.startsWith("fibonacci") ? "Giochi di Fibonacci" : "Scolastiche";

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      async (event) => {
        if (event.source !== ref.current?.contentWindow) return;

        try {
          const message = quizmsInMessageSchema.parse(event.data);
          let response: object;
          switch (message.type) {
            case "getTitle":
              response = { success: true, messageId: message.messageId, data: title };
              break;
            case "logout":
              response = await logout(message.messageId);
              break;
            default:
              response = await processQuizmsMessage(message);
              break;
          }
          ref.current?.contentWindow?.postMessage(response, quizmsUrl);
        } catch (err) {
          console.error(err);
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [title, quizmsUrl]);

  return <iframe ref={ref} src={`${quizmsUrl}/${contest}`} title="QuizMS" className="grow" />;
}
