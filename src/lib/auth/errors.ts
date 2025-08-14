import { headers } from "next/headers";

import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { logger } from "better-auth";
import { APIError } from "better-call";

import type { auth } from "~/lib/auth";

export const authErrors: Record<keyof typeof auth.$ERROR_CODES | string, MessageDescriptor> = {
  ACCESS_DENIED: msg`Accesso negato`,
  ACCOUNT_NOT_FOUND: msg`Account non trovato`,
  ACCOUNT_NOT_LINKED: msg`Email già esistente`,
  BACKUP_CODES_NOT_ENABLED: msg`Codici di backup non abilitati`,
  COULDNT_UPDATE_YOUR_EMAIL: msg`Email non valida`,
  CREDENTIAL_ACCOUNT_NOT_FOUND: msg`Account non trovato`,
  EMAIL_CAN_NOT_BE_UPDATED: msg`L'email non può essere modificata`,
  EMAIL_IS_THE_SAME: msg`Email uguale alla precedente`,
  EMAIL_NOT_VERIFIED: msg`Email non verificata`,
  FAILED_TO_CREATE_SESSION: msg`Errore durante la creazione della sessione`,
  FAILED_TO_CREATE_USER: msg`Errore durante la creazione dell'utente`,
  FAILED_TO_GET_SESSION: msg`Errore durante il recupero della sessione`,
  FAILED_TO_GET_USER_INFO: msg`Errore durante il recupero dell'utente`,
  FAILED_TO_UNLINK_LAST_ACCOUNT: msg`Impossibile scollegare l'account`,
  FAILED_TO_UPDATE_USER: msg`Errore durante la modifica dell'utente`,
  ID_TOKEN_NOT_SUPPORTED: msg`ID token non supportato`,
  INVALID_BACKUP_CODE: msg`Codice di backup non valido`,
  INVALID_CODE: msg`Autenticazione fallita`,
  INVALID_EMAIL: msg`Email non valida`,
  INVALID_EMAIL_OR_PASSWORD: msg`Email o password non valide`,
  INVALID_PASSWORD: msg`Password non valida`,
  INVALID_TOKEN: msg`Token non valido`,
  INVALID_USERNAME: msg`Username non valido`,
  INVALID_USERNAME_OR_PASSWORD: msg`Username o password non validi`,
  OAUTH_CODE_VERIFICATION_FAILED: msg`Autenticazione fallita`,
  OTP_HAS_EXPIRED: msg`OTP scaduto`,
  OTP_NOT_ENABLED: msg`OTP non abilitato`,
  PASSWORD_COMPROMISED: msg`Password troppo debole`,
  PASSWORD_TOO_LONG: msg`Password troppo lunga`,
  PASSWORD_TOO_SHORT: msg`Password troppo corta`,
  PLEASE_RESTART_THE_PROCESS: msg`Ripetere autenticazione`,
  PROVIDER_NOT_FOUND: msg`Provider non trovato`,
  SESSION_EXPIRED: msg`Sessione scaduta`,
  SOCIAL_ACCOUNT_ALREADY_LINKED: msg`Account già collegato`,
  STATE_NOT_FOUND: msg`Richiesta non valida`,
  TOKEN_EXPIRED: msg`Token scaduto`,
  TOTP_NOT_ENABLED: msg`TOTP non abilitato`,
  TWO_FACTOR_NOT_ENABLED: msg`2FA non abilitato`,
  USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER: msg`Username non disponibile`,
  USERNAME_IS_INVALID: msg`Username non valido`,
  USERNAME_IS_TOO_LONG: msg`Username troppo lungo`,
  USERNAME_IS_TOO_SHORT: msg`Username troppo corto`,
  USER_ALREADY_EXISTS: msg`Utente già esistente`,
  USER_EMAIL_NOT_FOUND: msg`Email non trovata`,
  USER_NOT_FOUND: msg`Utente non trovato`,
  VALIDATION_ERROR: msg`Dati non validi`,
};

export async function getAuthError(err: unknown): Promise<MessageDescriptor> {
  const isCommonError =
    err instanceof APIError &&
    (err.body?.code === "INVALID_EMAIL_OR_PASSWORD" ||
      err.body?.code === "INVALID_USERNAME_OR_PASSWORD");

  if (!isCommonError) {
    const headersList = await headers();
    logger.error(`Auth error (from ${headersList.get("referer")}):\n${err}`);
  }

  if (err instanceof APIError) {
    const code = err.body?.code;
    if (code && code in authErrors) {
      return authErrors[code as keyof typeof authErrors];
    }
    logger.error(`Missing auth code "${code}"`);
  }
  if (process.env.NODE_ENV === "development") {
    throw err;
  }
  return msg`Errore sconosciuto`;
}
