"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import useSWR from "swr";

import { H2 } from "~/components/header";
import type { NotificationEventType } from "~/lib/notifications/types";

import { getSubscriptionEvents, saveSubscription } from "./actions";

async function checkSubscription() {
  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();
  if (!existingSubscription) return [];
  const events = await getSubscriptionEvents(existingSubscription.toJSON());
  return events ?? [];
}

async function updateSubscription(
  applicationServerKey: string | undefined,
  events: NotificationEventType[],
) {
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }
  await saveSubscription(subscription.toJSON(), events);
  return events;
}

export function PageClient({ applicationServerKey }: { applicationServerKey?: string }) {
  const { t } = useLingui();
  const { data: events, isLoading, mutate } = useSWR("subscribed-events", checkSubscription);

  const handleToggle = async (event: NotificationEventType) => {
    if (isLoading) return;

    if (events?.includes(event)) {
      const newEvents = events.filter((e) => e !== event);
      await mutate(() => updateSubscription(applicationServerKey, newEvents), {
        optimisticData: newEvents,
      });
    } else {
      const newEvents = [...(events ?? []), event];
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await mutate(() => updateSubscription(applicationServerKey, newEvents), {
          optimisticData: newEvents,
        });
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <H2 className="mb-2">
        <Trans>Notifiche</Trans>
      </H2>
      <div>
        <Trans>Abilita le notifiche che desideri ricevere</Trans>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <div
            className={clsx(!isLoading && Notification.permission === "denied" && "tooltip")}
            data-tip={t`Autorizzazione notifiche negata`}>
            <input
              type="checkbox"
              className="checkbox"
              checked={events?.includes("new-task") ?? false}
              onChange={() => handleToggle("new-task")}
              disabled={isLoading || Notification.permission === "denied"}
            />
          </div>
          <span className="label-text">
            <Trans>Pubblicazione di nuovi task</Trans>
          </span>
        </label>
      </div>
    </div>
  );
}
