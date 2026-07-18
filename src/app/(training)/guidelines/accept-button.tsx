"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, useNotifications } from "@olinfo/react-components";
import { Check } from "lucide-react";

import { acceptGuidelines } from "./actions";

export function AcceptGuidelinesButton({ accepted }: { accepted: boolean }) {
  const { t } = useLingui();
  const { notifyError } = useNotifications();
  const router = useRouter();
  const redirectTo = useSearchParams().get("redirect");

  const [isAccepted, setAccepted] = useState(accepted);

  if (isAccepted) {
    return (
      <Button className="btn-success" disabled>
        <Check size={22} /> <Trans>Accettato</Trans>
      </Button>
    );
  }

  const accept = async () => {
    const err = await acceptGuidelines();
    if (err) {
      notifyError(new Error(t(err)));
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      await new Promise(() => {});
    }

    setAccepted(true);
  };

  return (
    <Button className="btn-primary" onClick={accept}>
      <Trans>Accetta le linee guida</Trans>
    </Button>
  );
}
