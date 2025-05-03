import { Trans, useLingui } from "@lingui/react/macro";
import {
  Navbar as BaseNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarSubmenu,
} from "@olinfo/react-components";

import logo from "~/app/icon0.svg";
import { Link } from "~/components/link";
import { LocaleDropdown } from "~/components/navbar/locale-dropdown";
import { UserDropdown } from "~/components/navbar/user-dropdown";

export function Navbar() {
  const { t } = useLingui();

  return (
    <BaseNavbar color="bg-base-300 text-base-content">
      <NavbarBrand>
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={t`Logo OII`}
          className="h-full w-auto"
        />
      </NavbarBrand>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/">
            <Trans>Home</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarSubmenu title={t`Problemi`}>
          <NavbarMenuItem>
            <Link href="/scolastiche">
              <Trans>Scolastiche</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/terry/1">
              <Trans>Territoriali</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/1">
              <Trans>Nazionali e OIS</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/techniques">
              <Trans>Problemi per tecnica</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/events">
              <Trans>Problemi per gara</Trans>
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/tasks/years/oii">
              <Trans>Problemi per anno</Trans>
            </Link>
          </NavbarMenuItem>
        </NavbarSubmenu>
        <NavbarMenuItem>
          <Link href="/ranking/1">
            <Trans>Classifica</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/algobadge">
            <Trans>Algobadge</Trans>
          </Link>
        </NavbarMenuItem>
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
