import type { User } from "better-auth";

import { Button } from "./button";

export function DeleteAccount({
  origin,
  user,
  token,
}: {
  origin: string;
  user: User;
  token: string;
}) {
  return (
    <div>
      <p>Ciao {user.name},</p>
      <p>
        abbiamo ricevuto una richiesta per cancellare il tuo account su training.olinfo.it. Per
        procedere con la cancellazione definitiva, ti chiediamo di confermare questa operazione.
      </p>
      <p style={{ fontStyle: "bold" }}>
        Attenzione! Questa operazione è irreversibile. Se desideri confermare la cancellazione del
        tuo account, clicca sul link qui sotto:
      </p>
      <Button
        url={`${origin}/delete-account?token=${encodeURIComponent(token)}`}
        text="Cancella account"
      />
      <p>
        Il link sarà valido solo per 60 minuti. Se non hai richiesto tu la cancellazione
        dell'account, ignora semplicemente questa email.
      </p>
    </div>
  );
}
