import type { MessageDescriptor } from "@lingui/core";

export type NotificationEventType = "new-task";

export type NotificationPayload = {
  title: string;
  body?: string;
  url: string;
};

export type NotificationTemplate = {
  title: MessageDescriptor;
  body?: MessageDescriptor;
  url: string;
};
