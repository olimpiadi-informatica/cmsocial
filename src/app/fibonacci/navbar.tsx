import { Trans, useLingui } from "@lingui/react/macro";
import {
  Navbar as BaseNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
} from "@olinfo/react-components";

import { Link } from "~/components/link";
import { LocaleDropdown } from "~/components/navbar/locale-dropdown";

import logo from "./icon.jpg";

export function Navbar() {
  const { t } = useLingui();

  return (
    <BaseNavbar color="bg-base-300 text-base-content">
      <NavbarBrand>
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={t`Logo Giochi di Fibonacci`}
          className="h-full w-auto rounded"
        />
      </NavbarBrand>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/fibonacci">
            <Trans>Home</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/fibonacci/primarie">
            <Trans>Scuole Primarie</Trans>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/fibonacci/secondarie">
            <Trans>Scuole Secondarie</Trans>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
      <NavbarContent>
        <LocaleDropdown />
      </NavbarContent>
    </BaseNavbar>
  );
}
