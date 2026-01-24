import { and, arrayContains, eq, gt, lt, max, sql } from "drizzle-orm";

import { cmsDb } from "~/lib/db";
import { pushSubscriptions, tasks } from "~/lib/db/schema";
import { outLogger } from "~/lib/logger";

import { sendPushNotification } from "./push";
import type { NotificationEventType, NotificationTemplate } from "./types";

export async function saveNotificationSubscription(
  userId: string,
  userAgent: string | null,
  locale: string,
  subscription: PushSubscriptionJSON,
  eventTypes: NotificationEventType[],
) {
  if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error("Invalid subscription");
  }

  const lastEventIds = sql`JSONB_BUILD_OBJECT(
    'new-task', ${cmsDb.select({ id: max(tasks.id) }).from(tasks)}
  )`;

  await cmsDb
    .insert(pushSubscriptions)
    .values({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
      userAgent,
      locale,
      eventTypes,
      lastEventIds,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { eventTypes, locale, lastEventIds },
    });
}

export async function getNotificationSubscriptionEvents(endpoint: string) {
  const subscription = await cmsDb
    .select({ eventTypes: pushSubscriptions.eventTypes })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .limit(1);
  return subscription[0]?.eventTypes as NotificationEventType[] | undefined;
}

const CHUNK_SIZE = 16;

export async function sendNotificationToUsers(
  eventType: NotificationEventType,
  eventId: number,
  payload: NotificationTemplate,
) {
  outLogger.info(`Sending ${eventType} notification`, { eventId });

  const query = (lastId = 0) =>
    cmsDb
      .select({
        id: pushSubscriptions.id,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
        locale: pushSubscriptions.locale,
      })
      .from(pushSubscriptions)
      .where(
        and(
          arrayContains(pushSubscriptions.eventTypes, [eventType]),
          lt(sql`(${pushSubscriptions.lastEventIds} ->> ${eventType})::int`, eventId),
          gt(pushSubscriptions.id, lastId).if(lastId),
        ),
      )
      .orderBy(pushSubscriptions.id)
      .limit(CHUNK_SIZE);

  let count = 0;
  let subscriptions = await query();
  const pool = new Map<number, Promise<any>>();

  while (subscriptions.length > 0) {
    while (pool.size >= CHUNK_SIZE) {
      await Promise.race(pool.values());
    }

    for (const subscription of subscriptions) {
      pool.set(
        subscription.id,
        sendPushNotification(eventType, eventId, subscription, payload).then(() =>
          pool.delete(subscription.id),
        ),
      );
    }

    count += subscriptions.length;

    subscriptions = await query(subscriptions.at(-1)!.id);
  }
  await Promise.all(pool.values());

  outLogger.info(`Finished sending ${eventType} notification`, { eventId, count });
}
