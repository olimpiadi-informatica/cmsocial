import type { User } from "better-auth";

import { Button } from "./button";

export function VerifyEmail({ user, token }: { user: User; token: string }) {
  return (
    <div>
      <p>Ciao {user.name},</p>
      <p>grazie per esserti registrato/a su training.olinfo.it!</p>
      <p>
        Per completare la registrazione, ti chiediamo di verificare il tuo indirizzo email. Clicca
        sul pulsante qui sotto per confermare il tuo indirizzo:
      </p>
      <Button url={`/verify-email?token=${encodeURIComponent(token)}`} text="Verifica email" />
      <p>
        Il link sarà valido solo per 60 minuti. Se non hai richiesto tu questa registrazione, ignora
        semplicemente questa email.
      </p>
    </div>
  );
}
