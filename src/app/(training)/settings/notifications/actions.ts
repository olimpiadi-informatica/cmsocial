"use server";

import { headers } from "next/headers";

import { loadLocale } from "~/lib/locale";
import {
  getNotificationSubscriptionEvents,
  saveNotificationSubscription,
} from "~/lib/notifications";
import type { NotificationEventType } from "~/lib/notifications/types";
import { getSessionUser } from "~/lib/user";

export async function saveSubscription(
  subscription: PushSubscriptionJSON,
  events: NotificationEventType[],
) {
  const i18n = await loadLocale();
  const headerList = await headers();
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await saveNotificationSubscription(
    user.id,
    headerList.get("user-agent"),
    i18n.locale,
    subscription,
    events,
  );
}

// biome-ignore lint/suspicious/useAwait: server actions must be async
export async function getSubscriptionEvents(subscription: PushSubscriptionJSON) {
  if (!subscription.endpoint) {
    throw new Error("Invalid subscription");
  }
  return getNotificationSubscriptionEvents(subscription.endpoint);
}
