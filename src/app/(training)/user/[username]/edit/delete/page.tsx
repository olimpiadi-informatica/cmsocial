import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Trans } from "@lingui/macro";
import { getMeSync } from "@olinfo/training-api";

import { H2 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

export default async function Page() {
  await loadLocale();

  const token = cookies().get("training_token")?.value;
  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent("/user/me/edit/delete")}`);
  }
  const user = getMeSync(token);

  const to = "info@olimpiadi-informatica.it";
  const subject = "Richiesta di cancellazione dell'account di training";
  const body = `\
Gentile staff delle Olimpiadi di Informatica,

con la presente email, chiedo la cancellazione dell'account di training.olinfo.it associato a questa email (${user.email}) e di tutti i dati ad esso collegati.

Resto in attesa di una conferma al termine della procedura e vi ringrazio per la vostra collaborazione.

Cordiali saluti,
${user.firstName} ${user.lastName}`;

  const link = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div>
      <H2>
        <Trans>Eliminazione account</Trans>
      </H2>
      <div className="text-center mt-4 mb-8">
        <Trans>Per eliminare il tuo account, contattaci via email.</Trans>
      </div>
      <div className="mockup-window bg-base-300 border border-base-content/40">
        <div className="bg-base-200 px-6 py-4 *:px-px *:pb-2 *:mb-2 *:border-b *:border-b-base-content/40">
          <div>
            <span className="text-base-content/60 font-semibold select-none">
              <Trans>A:</Trans>{" "}
            </span>
            <a className="link link-info" href={link}>
              {to}
            </a>
          </div>
          <div>
            <span className="text-base-content/60 font-semibold select-none">
              <Trans>Oggetto:</Trans>{" "}
            </span>
            {subject}
          </div>
          <div>
            <span className="text-base-content/60 font-semibold select-none">
              <Trans>Da:</Trans>{" "}
            </span>
            {user.email}
          </div>
          <div className="whitespace-pre-line mt-4 !border-b-0">{body}</div>
        </div>
      </div>
    </div>
  );
}
