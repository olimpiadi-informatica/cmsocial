import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Training - Recupero password",
};

export default function Page() {
  return <PageClient captchaKey={process.env.CAPTCHA_PUBLIC_KEY!} />;
}
