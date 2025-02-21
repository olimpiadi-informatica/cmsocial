import { Baloo_2 } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";
import {
  Navbar as BaseNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
} from "@olinfo/react-components";
import clsx from "clsx";
import { Gem } from "lucide-react";

import { LocaleDropdown } from "~/components/navbar/locale-dropdown";
import { UserDropdown } from "~/components/navbar/user-dropdown";
import { Badge, badgeColor } from "~/lib/algobadge";
import { loadLocale } from "~/lib/locale";

const titleFont = Baloo_2({ weight: ["400", "500"], subsets: ["latin"], display: "swap" });

export default async function Layout({ children }: { children: ReactNode }) {
  await loadLocale();

  return (
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 py-4">{children}</div>
    </>
  );
}

function Navbar() {
  return (
    <BaseNavbar color="bg-base-300 text-base-content">
      <NavbarBrand>
        <Title />
      </NavbarBrand>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/">
            <Trans>Home</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/algobadge">
            <Trans>Categorie</Trans>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
      <NavbarContent>
        <LocaleDropdown />
        <UserDropdown />
      </NavbarContent>
    </BaseNavbar>
  );
}

function Title() {
  const color = (threshold: Badge) => clsx(badgeColor[threshold], "font-bold");

  const bronze = color(Badge.Bronze);
  const silver = color(Badge.Silver);
  const gold = color(Badge.Gold);
  const diamond = color(Badge.Diamond);

  return (
    <div className={clsx("max-xs:text-lg text-3xl xs:-translate-y-1", titleFont.className)}>
      <span className={clsx("max-xs:text-2xl text-4xl", silver)}>A</span>
      LG
      <span className={gold}>O</span>
      <span className={clsx("max-xs:text-2xl text-4xl", bronze)}>B</span>A
      <span className={diamond}>D</span>
      GE
      <Gem
        size={32}
        strokeWidth={2.5}
        className={clsx("ml-2 inline-block align-sub max-sm:hidden", diamond)}
      />
    </div>
  );
}
