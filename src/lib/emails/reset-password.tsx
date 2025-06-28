import type { User } from "better-auth";

import { Button } from "./button";

export function ResetPassword({
  origin,
  user,
  token,
}: {
  origin: string;
  user: User;
  token: string;
}) {
  const params = new URLSearchParams({ token, email: user.email });

  return (
    <div>
      <p>Ciao {user.name},</p>
      <p>
        abbiamo ricevuto una richiesta per reimpostare la password del tuo account su
        training.olinfo.it. Per procedere con il reset, clicca sul pulsante qui sotto:
      </p>
      <Button url={`${origin}/reset-password?${params}`} text="Reimposta password" />
      <p>
        Il link sarà valido solo per 60 minuti. Se non hai richiesto tu il reset della password,
        ignora semplicemente questa email.
      </p>
    </div>
  );
}
