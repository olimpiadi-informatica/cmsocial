import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { APIError } from "better-call";

import type { auth } from "~/lib/auth";

export const authErrors: Record<keyof typeof auth.$ERROR_CODES | string, MessageDescriptor> = {
  ACCOUNT_NOT_FOUND: msg`Username non trovato`,
  BACKUP_CODES_NOT_ENABLED: msg`Codici di backup non abilitati`,
  CREDENTIAL_ACCOUNT_NOT_FOUND: msg`Username non trovato`,
  EMAIL_CAN_NOT_BE_UPDATED: msg`L'email non può essere modificata`,
  EMAIL_NOT_VERIFIED: msg`Email non verificata`,
  FAILED_TO_CREATE_SESSION: msg`Errore durante la creazione della sessione`,
  FAILED_TO_CREATE_USER: msg`Errore durante la creazione dell'utente`,
  FAILED_TO_GET_SESSION: msg`Errore durante il recupero della sessione`,
  FAILED_TO_GET_USER_INFO: msg`Errore durante il recupero dell'utente`,
  FAILED_TO_UNLINK_LAST_ACCOUNT: msg`Impossibile scollegare l'account`,
  FAILED_TO_UPDATE_USER: msg`Errore durante la modifica dell'utente`,
  ID_TOKEN_NOT_SUPPORTED: msg`ID token non supportato`,
  INVALID_BACKUP_CODE: msg`Codice di backup non valido`,
  INVALID_EMAIL: msg`Email non valida`,
  INVALID_EMAIL_OR_PASSWORD: msg`Email o password non valide`,
  INVALID_PASSWORD: msg`Password non valida`,
  INVALID_TOKEN: msg`Token non valido`,
  INVALID_USERNAME: msg`Username non valido`,
  INVALID_USERNAME_OR_PASSWORD: msg`Username o password non validi`,
  OTP_HAS_EXPIRED: msg`OTP scaduto`,
  OTP_NOT_ENABLED: msg`OTP non abilitato`,
  PASSWORD_COMPROMISED: msg`Password troppo debole`,
  PASSWORD_TOO_LONG: msg`Password troppo lunga`,
  PASSWORD_TOO_SHORT: msg`Password troppo corta`,
  PROVIDER_NOT_FOUND: msg`Provider non trovato`,
  SESSION_EXPIRED: msg`Sessione scaduta`,
  SOCIAL_ACCOUNT_ALREADY_LINKED: msg`Account già collegato`,
  TOTP_NOT_ENABLED: msg`TOTP non abilitato`,
  TWO_FACTOR_NOT_ENABLED: msg`2FA non abilitato`,
  USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER: msg`Username non disponibile`,
  USER_ALREADY_EXISTS: msg`Utente già esistente`,
  USER_EMAIL_NOT_FOUND: msg`Email non trovata`,
  USER_NOT_FOUND: msg`Utente non trovato`,
};

export function getAuthError(err: unknown): MessageDescriptor {
  if (err instanceof APIError) {
    const code = err.body?.code;
    if (code && code in authErrors) {
      return authErrors[code as keyof typeof authErrors];
    }
  }
  if (process.env.NODE_ENV === "development") {
    throw err;
  }
  return msg`Errore sconosciuto`;
}
