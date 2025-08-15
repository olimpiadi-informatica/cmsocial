"use client";

import { Roboto } from "next/font/google";
import type { StaticImageData } from "next/image";

import { SiGithub } from "@icons-pack/react-simple-icons";
import type { MessageDescriptor } from "@lingui/core";
import { Trans, useLingui } from "@lingui/react/macro";
import { useNotifications } from "@olinfo/react-components";
import clsx from "clsx";

import googleLogo from "./google.svg";
import olimanagerLogo from "./olimanager.svg";

const robotoFont = Roboto({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  provider: "github" | "google" | "olimanager";
  onClick: (provider: string) => Promise<MessageDescriptor>;
  disabled?: boolean;
  type: "login" | "signup" | "link" | "unlink";
};

export function OauthButton({ provider, onClick, disabled, type }: Props) {
  const { notifyError } = useNotifications();
  const { t } = useLingui();
  const name = providerName(provider);

  const login = async () => {
    const err = await onClick(provider.toLowerCase());
    if (err) notifyError(new Error(t(err)));
  };

  return (
    <button
      type="button"
      className={clsx(
        "flex gap-2.5 w-full px-3 py-2.5 rounded-full border text-sm pointer",
        "border-[#747775] text-[#1F1F1F] bg-white",
        "dark:border-[#8E918F] dark:text-[#E3E3E3] dark:bg-[#131314]",
        disabled && "cursor-not-allowed opacity-50",
        robotoFont.className,
      )}
      onClick={login}
      disabled={disabled}>
      <div className="h-5 *:h-full *:w-auto">
        <Icon provider={provider} />
      </div>
      <div className="grow">
        {type === "login" && <Trans>Accedi con {name}</Trans>}
        {type === "signup" && <Trans>Registrati con {name}</Trans>}
        {type === "link" && <Trans>Collega account {name}</Trans>}
        {type === "unlink" && <Trans>Scollega account {name}</Trans>}
      </div>
    </button>
  );
}

function providerName(provider: "github" | "google" | "olimanager") {
  switch (provider) {
    case "github":
      return "GitHub";
    case "google":
      return "Google";
    case "olimanager":
      return "Olimpiadi Scientifiche";
  }
}

function Icon({ provider }: { provider: "github" | "google" | "olimanager" }) {
  switch (provider) {
    case "github":
      return <SiGithub />;
    case "google":
      return <Image src={googleLogo} alt="Google" />;
    case "olimanager":
      return <Image src={olimanagerLogo} alt="Olimpiadi Scientifiche" />;
  }
}

function Image({ src, alt }: { src: StaticImageData; alt: string }) {
  return <img src={src.src} width={src.width} height={src.height} alt={alt} />;
}
