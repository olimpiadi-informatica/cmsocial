import { headers } from "next/headers";
import { after, type NextRequest, type NextResponse } from "next/server";

import { Logging } from "@google-cloud/logging";
import type { LogEntry } from "@google-cloud/logging/build/src/entry";
import type { CloudLoggingHttpRequest } from "@google-cloud/logging/build/src/utils/http-request";
import type { Logger as AuthLogger } from "better-auth";
import { merge, toUpper } from "lodash-es";
import { isErrorLike, serializeError } from "serialize-error";

const logging = process.env.NODE_ENV === "production" ? new Logging() : null;

export async function logRequest(
  req: NextRequest,
  res: NextResponse,
  userId: string,
  trace: string,
  latency: bigint,
) {
  if (!logging) return;
  const requestSize = req.headers.get("content-length");
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0];
  const referer = req.headers.get("referer") ?? undefined;
  const host = req.headers.get("x-forwarded-host") ?? "";

  const requestUrl = req.nextUrl.clone();
  requestUrl.port = "";
  requestUrl.host = host;

  const httpRequest: CloudLoggingHttpRequest = {
    requestMethod: req.method,
    requestUrl: requestUrl.href,
    requestSize: requestSize ? Number(requestSize) : undefined,
    status: res.status,
    userAgent,
    remoteIp,
    referer,
    latency: {
      seconds: Number(latency / 1_000_000_000n),
      nanos: Number(latency % 1_000_000_000n),
    },
  };

  const metadata: LogEntry = {
    severity: "INFO",
    labels: { service: host },
    httpRequest,
    trace,
  };
  if (userId) {
    metadata.labels!.userId = userId;
  }

  const log = logging.log("training-requests");
  const entry = log.entry(metadata);
  await log.write(entry);
}

function writeLog(
  logName: string,
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR",
  message: string,
  data?: any,
) {
  if (!logging) return;
  after(async () => {
    const headerList = await headers();
    const trace = headerList.get("x-trace");
    const host = headerList.get("x-forwarded-host") ?? "";

    const metadata: LogEntry = {
      severity,
      labels: { service: host },
      trace,
    };

    const log = logging.log(`training-${logName}`);
    const entry = log.entry(
      metadata,
      isErrorLike(data) ? { error: serializeError(data), message } : { ...data, message },
    );
    await log.write(entry);
  });
}

export const logger = {
  info: writeLog.bind(null, "generic", "INFO"),
  warn: writeLog.bind(null, "generic", "WARNING"),
  error: writeLog.bind(null, "generic", "ERROR"),
};

export const authLogger: AuthLogger = {
  level: "info",
  log: (level, message, ...params) => {
    switch (level) {
      case "debug":
      case "info":
      case "error":
        return writeLog("auth", toUpper(level), message, merge({}, ...params));
      case "warn":
        return writeLog("auth", "WARNING", message, merge({}, ...params));
    }
  },
};
