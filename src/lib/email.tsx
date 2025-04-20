import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// @ts-ignore
import { renderToStaticMarkup } from "next/dist/compiled/react-dom/server";
import type { ReactNode } from "react";

import type { User } from "better-auth";
import { type SendMailOptions, createTransport } from "nodemailer";
import type StreamTransport from "nodemailer/lib/stream-transport";

import { ChangeEmail } from "~/lib/emails/change-email";
import { DeleteAccount } from "./emails/delete-account";
import { ResetPassword } from "./emails/reset-password";
import { Template } from "./emails/template";
import { VerifyEmail } from "./emails/verify-email";

const transporter =
  process.env.NODE_ENV === "production"
    ? createTransport({
        host: process.env.MAIL_SERVER,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      })
    : createTransport({
        streamTransport: true,
      });

export async function sendEmail(address: string, subject: string, body: ReactNode) {
  const html: string = renderToStaticMarkup(<Template title={subject}>{body}</Template>);

  const message: SendMailOptions = {
    from: {
      name: process.env.MAIL_FROM_NAME!,
      address: process.env.MAIL_FROM_ADDRESS!,
    },
    to: address,
    subject: subject,
    html,
  };
  const email = await transporter.sendMail(message);
  if (process.env.NODE_ENV !== "production") {
    const message = (email as StreamTransport.SentMessageInfo).message;

    const dir = path.join("emails", address);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${Date.now()}.eml`), message);
  }
}

export function sendResetPassword(data: { user: User; token: string }) {
  return sendEmail(
    data.user.email,
    "Reimposta password - training.olinfo.it",
    <ResetPassword user={data.user} token={data.token} />,
  );
}

export function sendVerificationEmail(data: { user: User; token: string }) {
  return sendEmail(
    data.user.email,
    "Verifica email - training.olinfo.it",
    <VerifyEmail user={data.user} token={data.token} />,
  );
}

export function sendChangeEmailVerification(data: {
  user: User;
  newEmail: string;
  token: string;
}) {
  return sendEmail(
    data.newEmail,
    "Cambia email - training.olinfo.it",
    <ChangeEmail user={data.user} token={data.token} />,
  );
}

export function sendDeleteAccountVerification(data: { user: User; token: string }) {
  return sendEmail(
    data.user.email,
    "Cancella account - training.olinfo.it",
    <DeleteAccount user={data.user} token={data.token} />,
  );
}
