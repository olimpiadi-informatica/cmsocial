"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, CardActions } from "@olinfo/react-components";
import { RotateCcw, Undo } from "lucide-react";

import { step2Back, step2Resend } from "./actions";
import gmail from "./gmail.svg";

export function Step2() {
  const { t } = useLingui();

  const back = async () => {
    const err = await step2Back();
    if (err) throw new Error(t(err));
    await new Promise(() => {});
  };

  const resend = async () => {
    const err = await step2Resend();
    if (err) throw new Error(t(err));
  };

  return (
    <>
      <div className="text-center">
        <Trans>Controlla la tua casella di posta per verificare l'account</Trans>
      </div>
      <CardActions>
        <Button className="btn-neutral" onClick={back} icon={Undo}>
          <Trans>Indietro</Trans>
        </Button>
        <Button className="btn-neutral" onClick={resend} icon={RotateCcw}>
          <Trans>Rimanda email</Trans>
        </Button>
        <a
          href="https://mail.google.com"
          className="btn btn-neutral"
          target="_blank"
          rel="noreferrer">
          <img
            src={gmail.src}
            width={gmail.width}
            height={gmail.height}
            className="size-5"
            alt={t`Logo Outlook`}
          />
          <Trans>Apri Gmail</Trans>
        </a>
      </CardActions>
    </>
  );
}
