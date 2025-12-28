import { headers } from "next/headers";
import { after, type NextRequest } from "next/server";

import { Logging } from "@google-cloud/logging";
import type { LogEntry } from "@google-cloud/logging/build/src/entry";
import type { CloudLoggingHttpRequest } from "@google-cloud/logging/build/src/utils/http-request";
import type { Logger as AuthLogger, InternalLogger } from "better-auth";
import { merge, toUpper } from "lodash-es";
import { isErrorLike, serializeError } from "serialize-error";

const logging = process.env.NODE_ENV === "production" ? new Logging() : null;
const serviceName = process.env.SERVICE_NAME ?? "training";

function buildEntry(entry: LogEntry): LogEntry {
  return {
    ...entry,
    resource: {
      type: "generic_node",
      labels: {
        location: "global",
        namespace: "training",
        node_id: serviceName,
      },
    },
    labels: {
      service: serviceName,
    },
  };
}

export async function logRequest(req: NextRequest, userId: string | undefined, trace?: string) {
  if (!logging) return;
  const requestSize = req.headers.get("content-length");
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const remoteIp = req.headers.get("x-real-ip") ?? undefined;
  const referer = req.headers.get("referer") ?? undefined;
  const host = req.headers.get("x-forwarded-host");

  const requestUrl = req.nextUrl.clone();
  if (host) {
    requestUrl.port = "";
    requestUrl.host = host;
  }

  const httpRequest: CloudLoggingHttpRequest = {
    requestMethod: req.method,
    requestUrl: requestUrl.href,
    requestSize: requestSize ? Number(requestSize) : undefined,
    status: 200,
    userAgent,
    remoteIp,
    referer,
  };

  const labels: Record<string, string> = {};
  if (userId) {
    labels.userId = userId;
  }

  const metadata = buildEntry({
    severity: "INFO",
    httpRequest,
    labels,
    trace,
  });

  const log = logging.log("training-requests");
  const entry = log.entry(metadata);
  await log.write(entry);
}

async function writeLog(
  logName: string,
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR",
  headerList: Headers | null | undefined,
  message: string,
  data?: any,
) {
  if (!logging) return;

  const trace = headerList?.get("x-trace");

  const log = logging.log(`training-${logName}`);
  const entry = log.entry(
    buildEntry({ severity, trace }),
    isErrorLike(data) ? { error: serializeError(data), message } : { ...data, message },
  );
  await log.write(entry);
}

function logInsideRequest(
  logName: string,
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR",
  message: string,
  data?: any,
) {
  after(async () => writeLog(logName, severity, await headers(), message, data));
}

function logOutsideRequest(
  logName: string,
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR",
  message: string,
  data?: any,
  headerList?: Headers | null,
) {
  void writeLog(logName, severity, headerList, message, data);
}

export const logger = {
  info: logInsideRequest.bind(null, "generic", "INFO"),
  warn: logInsideRequest.bind(null, "generic", "WARNING"),
  error: logInsideRequest.bind(null, "generic", "ERROR"),
};

export const outLogger = {
  info: logOutsideRequest.bind(null, "generic", "INFO"),
  warn: logOutsideRequest.bind(null, "generic", "WARNING"),
  error: logOutsideRequest.bind(null, "generic", "ERROR"),
};

function logAuth(
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR",
  headerList: Headers | null | undefined,
  message: string,
  ...params: any[]
) {
  logOutsideRequest("auth", severity, message, merge({}, ...params), headerList);
}

export const authLogger: AuthLogger = {
  level: "info",
  log: (level, message, ...params) => {
    const severity = level === "warn" ? "WARNING" : toUpper(level);
    logAuth(severity, null, message, ...params);
  },
};

export function authInternalLogger(headerList?: Headers): InternalLogger {
  return {
    level: "info",
    debug: logAuth.bind(null, "DEBUG", headerList),
    info: logAuth.bind(null, "INFO", headerList),
    success: logAuth.bind(null, "INFO", headerList),
    warn: logAuth.bind(null, "WARNING", headerList),
    error: logAuth.bind(null, "ERROR", headerList),
  };
}
