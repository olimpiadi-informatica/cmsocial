"use server";

import { headers } from "next/headers";

import { loadLocale } from "~/lib/locale";
import { saveNotificationSubscription } from "~/lib/notifications";
import { getSessionUser } from "~/lib/user";

export async function saveSubscription(subscription: PushSubscriptionJSON) {
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
    ["new-task"],
  );
}
