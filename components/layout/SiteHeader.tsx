"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import { IconButton } from "@/components/ui/Button";
import { IconMenu, IconSearch } from "@/components/ui/icons";
import { CustomerFinanceControl } from "@/components/finance/CustomerFinanceControl";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Logo } from "@/components/navigation/Logo";
import { Container } from "@/components/layout/Container";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";

const headerPhone = showrooms.find((showroom) => showroom.telephone)?.telephone;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-3 z-[var(--oak-z-header)] mx-3 sm:mx-4 lg:top-4 lg:mx-6",
        elevated && !detailOpen && "rounded-[14px] bg-[#ECF3F8] shadow-[0_10px_28px_rgba(16,40,72,0.08)]",
        elevated && detailOpen && "rounded-t-[14px] bg-[#ECF3F8]",
        !elevated && detailOpen && "rounded-t-[32px] bg-[#ECF3F8]",
      )}
    >
      <Container
        width="wide"
        className="flex h-[var(--oak-header-height)] min-w-0 items-center gap-6 xl:gap-10"
      >
        <div className="shrink-0">
          <Logo />
        </div>
        <DesktopNav onDetailOpen={setDetailOpen} />
        <div className="ml-auto flex shrink-0 items-center gap-4 xl:gap-6">
          {headerPhone ? (
            <a
              href={`tel:${headerPhone.replace(/\s/g, "")}`}
              className="hidden text-[0.95rem] font-medium tracking-[-0.01em] text-ink no-underline min-[1380px]:inline"
            >
              {headerPhone}
            </a>
          ) : null}
          <Link
            href={routes.search}
            aria-label="Search cars"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white/70 lg:hidden"
          >
            <IconSearch />
          </Link>
          <CustomerFinanceControl />
          <IconButton
            label="Open menu"
            className="lg:hidden"
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
