"use client";

import Link from "next/link";
import { useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import { IconButton } from "@/components/ui/Button";
import { IconMenu, IconSearch } from "@/components/ui/icons";
import { CustomerFinanceControl } from "@/components/finance/CustomerFinanceControl";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Logo } from "@/components/navigation/Logo";
import { Container } from "@/components/layout/Container";
import { routes } from "@/config/routes";
import { SearchInput } from "@/components/forms/FormControls";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--oak-z-header)] bg-header/95 shadow-sm backdrop-blur">
      <Container className="flex h-[var(--oak-header-height)] min-w-0 items-center gap-2 sm:gap-3">
        <div className="shrink-0">
          <Logo />
        </div>
        <DesktopNav />
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <form
            action={routes.search}
            method="get"
            role="search"
            className="hidden min-w-0 2xl:block"
          >
            <label htmlFor="header-search" className="sr-only">
              Search cars
            </label>
            <SearchInput
              id="header-search"
              name="q"
              placeholder="Search"
              className="w-36 rounded-full lg:w-44 xl:w-56"
            />
          </form>
          <Link
            href={routes.search}
            aria-label="Search cars"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink hover:bg-page xl:hidden"
          >
            <IconSearch />
          </Link>
          <CustomerFinanceControl />
          <IconButton
            label="Open menu"
            className="xl:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu />
          </IconButton>
        </div>
      </Container>
      <Drawer open={menuOpen} title="Menu" onClose={() => setMenuOpen(false)}>
        <MobileNav onNavigate={() => setMenuOpen(false)} />
      </Drawer>
    </header>
  );
}
