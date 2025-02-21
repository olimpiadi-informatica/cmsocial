import { Baloo_2 } from "next/font/google";
import Link from "next/link";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Navbar as BaseNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarSubmenu,
} from "@olinfo/react-components";
import clsx from "clsx";
import { Gem, Medal } from "lucide-react";

import { LocaleDropdown } from "~/components/navbar/locale-dropdown";
import { UserDropdown } from "~/components/navbar/user-dropdown";
import { Badge, badgeColor } from "~/lib/algobadge";

const titleFont = Baloo_2({ weight: ["400", "500"], subsets: ["latin"], display: "swap" });

export function Navbar({ badge }: { badge: Badge }) {
  const { _ } = useLingui();

  return (
    <BaseNavbar color="bg-base-300 text-base-content">
      <NavbarBrand>
        <Title badge={badge} />
      </NavbarBrand>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/">
            <Trans>Home</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarSubmenu title={_(msg`Problemi`)}>
          <NavbarMenuItem>
            <Link href="/tasks/terry/1">
              <Trans>Territoriali</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/1">
              <Trans>Nazionali e altre gare</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/techniques">
              <Trans>Problemi per tecnica</Trans>
            </Link>
          </NavbarMenuItem>
        </NavbarSubmenu>
        <NavbarMenuItem>
          <Link href="https://forum.olinfo.it">
            <Trans>Forum</Trans>
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

function Title({ badge }: { badge: Badge }) {
  const color = (threshold: Badge) =>
    badge >= threshold ? clsx(badgeColor[threshold], "font-bold") : undefined;

  const honorable = color(Badge.Honorable);
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
      {badge >= Badge.Honorable && badge < Badge.Diamond && (
        <Medal
          size={32}
          strokeWidth={2.5}
          className={clsx(
            "ml-2 inline-block align-sub last:*:hidden max-sm:hidden",
            gold ?? silver ?? bronze ?? honorable,
          )}
        />
      )}
      {badge === Badge.Diamond && (
        <Gem
          size={32}
          strokeWidth={2.5}
          className={clsx("ml-2 inline-block align-sub max-sm:hidden", diamond)}
        />
      )}
    </div>
  );
}
