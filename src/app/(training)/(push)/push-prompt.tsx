"use client";

import { useEffect, useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, Modal, SubmitButton } from "@olinfo/react-components";
import { differenceInMonths } from "date-fns";
import useSWR from "swr";

import { saveSubscription } from "./actions";

async function checkSubscription() {
  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();
  return !!existingSubscription;
}

export function PushPrompt({ applicationServerKey }: { applicationServerKey?: string }) {
  const { t } = useLingui();
  const ref = useRef<HTMLDialogElement>(null);
  const { data: isSubscribed } = useSWR("notification-subscribed", checkSubscription);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("close", () =>
        localStorage.setItem("push-prompt-dismissed", new Date().toISOString()),
      );
    }
  }, []);

  useEffect(() => {
    if (!isSubscribed) {
      const dismissed = localStorage.getItem("push-prompt-dismissed");
      if (!dismissed || differenceInMonths(new Date(), dismissed) >= 4) {
        ref.current?.showModal();
      }
    }
  }, [isSubscribed]);

  const submit = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
        await saveSubscription(subscription.toJSON());
      }
    } finally {
      ref.current?.close();
    }
  };

  return (
    <Modal ref={ref} title={t`Ricevi notifiche`}>
      <p>
        <Trans>Vuoi ricevere notifiche quando vengono pubblicati nuovi problemi?</Trans>
      </p>
      <Form onSubmit={submit} className="!max-w-none">
        <SubmitButton>
          <Trans>Sì</Trans>
        </SubmitButton>
      </Form>
    </Modal>
  );
}
