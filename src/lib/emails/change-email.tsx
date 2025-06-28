import type { User } from "better-auth";

import { Button } from "./button";

export function ChangeEmail({
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
        abbiamo ricevuto una richiesta per cambiare l'email del tuo account su training.olinfo.it.
        Per completare la modifica, clicca sul pulsante qui sotto:
      </p>
      <Button
        url={`${origin}/verify-email?token=${encodeURIComponent(token)}`}
        text="Cambia email"
      />
      <p>
        Il link sarà valido solo per 60 minuti. Se non hai richiesto tu la modifica dell'email,
        ignora semplicemente questa email.
      </p>
    </div>
  );
}
