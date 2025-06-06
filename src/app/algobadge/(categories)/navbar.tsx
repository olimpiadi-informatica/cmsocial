import { Baloo_2 } from "next/font/google";

import { Trans, useLingui } from "@lingui/react/macro";
import {
  Navbar as BaseNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarSubmenu,
} from "@olinfo/react-components";
import clsx from "clsx";
import { BookmarkCheck, BookmarkX, Gem, Medal } from "lucide-react";

import { Link } from "~/components/link";
import { LocaleDropdown } from "~/components/navbar/locale-dropdown";
import { UserDropdown } from "~/components/navbar/user-dropdown";
import { Badge, badgeColor } from "~/lib/algobadge";

const titleFont = Baloo_2({ weight: ["400", "500"], subsets: ["latin"], display: "swap" });

export function Navbar({ badge }: { badge: Badge }) {
  const { t } = useLingui();

  return (
    <BaseNavbar color="bg-base-300/85 text-base-content">
      <NavbarBrand>
        <Link href="/algobadge">
          <Title badge={badge} />
        </Link>
      </NavbarBrand>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/">
            <Trans>Home</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarSubmenu title={t`Problemi`}>
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
      {badge <= Badge.None && (
        <BookmarkX
          size={32}
          strokeWidth={2.5}
          className="ml-2 inline-block align-sub max-sm:hidden text-error"
        />
      )}
      {badge === Badge.Honorable && (
        <BookmarkCheck
          size={32}
          strokeWidth={2.5}
          className={clsx("ml-2 inline-block align-sub max-sm:hidden", honorable)}
        />
      )}
      {badge >= Badge.Bronze && badge < Badge.Diamond && (
        <Medal
          size={32}
          strokeWidth={2.5}
          className={clsx(
            "ml-2 inline-block align-sub last:*:hidden max-sm:hidden",
            gold ?? silver ?? bronze,
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
