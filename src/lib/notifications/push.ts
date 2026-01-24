import { eq, sql } from "drizzle-orm";
import { type RequestOptions, sendNotification, WebPushError } from "web-push";

import { cmsDb } from "~/lib/db";
import { pushSubscriptions } from "~/lib/db/schema-cmsocial";
import { type Locale, setupLocale } from "~/lib/locale";
import { outLogger } from "~/lib/logger";

import type { NotificationEventType, NotificationPayload, NotificationTemplate } from "./types";

export async function sendPushNotification(
  eventType: NotificationEventType,
  eventId: number,
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
    locale: string;
  },
  payload: NotificationTemplate,
) {
  try {
    const i18n = await setupLocale(subscription.locale as Locale);
    const localizedPayload: NotificationPayload = {
      title: i18n._(payload.title),
      body: payload.body && i18n._(payload.body),
      url: payload.url,
    };

    await sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(localizedPayload),
      {
        timeout: 10_000,
        vapidDetails: {
          subject: "https://training.olinfo.it",
          publicKey: process.env.VAPID_PUBLIC_KEY!,
          privateKey: process.env.VAPID_PRIVATE_KEY!,
        },
      } satisfies RequestOptions,
    );
    await cmsDb
      .update(pushSubscriptions)
      .set({
        lastEventIds: sql`JSONB_SET(${pushSubscriptions.lastEventIds}, {${eventType}}, ${eventId})`,
      })
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
  } catch (error) {
    if (error instanceof WebPushError && error.statusCode === 410) {
      await cmsDb
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    } else {
      outLogger.error("Error sending push notification", error);
    }
  }
}
