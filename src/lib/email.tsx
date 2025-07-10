import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// @ts-ignore
import { renderToStaticMarkup } from "next/dist/compiled/react-dom/server";
import type { ReactNode } from "react";

import type { User } from "better-auth";
import { createTransport, type SendMailOptions } from "nodemailer";
import type StreamTransport from "nodemailer/lib/stream-transport";

import { DeleteAccount } from "./emails/delete-account";
import { ResetPassword } from "./emails/reset-password";
import { SignupEmail } from "./emails/signup-email";
import { Template } from "./emails/template";

const transporter =
  process.env.NODE_ENV === "production"
    ? createTransport({
        host: process.env.MAIL_SERVER,
        port: Number(process.env.MAIL_SERVER_PORT),
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

type Data = {
  user: User;
  token: string;
  url: string;
};

export function sendResetPassword(data: Data) {
  return sendEmail(
    data.user.email,
    "Reimposta password - training.olinfo.it",
    <ResetPassword origin={origin(data)} user={data.user} token={data.token} />,
  );
}

export function sendVerificationEmail(data: Data) {
  return sendEmail(
    data.user.email,
    "Verifica email - training.olinfo.it",
    <SignupEmail origin={origin(data)} token={data.token} />,
  );
}

export function sendDeleteAccountVerification(data: Data) {
  return sendEmail(
    data.user.email,
    "Cancella account - training.olinfo.it",
    <DeleteAccount origin={origin(data)} user={data.user} token={data.token} />,
  );
}

function origin(_data: Data) {
  // return new URL(data.url).origin;
  return "https://training.olinfo.it";
}
