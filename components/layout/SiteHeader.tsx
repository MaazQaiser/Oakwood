"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { IconClose, IconMenu, IconSearch } from "@/components/ui/icons";
import { CustomerFinanceControl } from "@/components/finance/CustomerFinanceControl";
import { SavedCarsLink } from "@/components/saved/SavedCarsLink";
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
  const menuId = useId();
  const menuWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setElevated(window.scrollY > 0);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuWrapRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    // Sticky shell at top:0. Inset padding is permanent so the bar never jumps
    // when it sticks — same vertical/horizontal position at rest and scrolled.
    // On scroll, the shell paints a full-bleed white bar (edge to edge, including
    // the left/right gutters) so content cannot show through.
    <div
      data-oak-header-shell=""
      data-elevated={elevated ? "true" : "false"}
      className={cn(
        "sticky top-0 z-[var(--oak-z-header)] w-full pt-3 -mb-3 transition-[background-color,box-shadow] duration-200 lg:pt-4 lg:-mb-4",
        elevated
          ? "bg-page shadow-[0_1px_0_var(--oak-border),0_10px_28px_rgba(66,69,78,0.06)]"
          : "bg-transparent",
      )}
    >
      <header
        className={cn(
          "relative px-6 lg:mx-[var(--oak-page-x)]",
          !elevated && detailOpen && "rounded-t-[32px] bg-page",
        )}
      >
        <Container
          width="wide"
          className="flex h-[var(--oak-header-height)] min-w-0 items-center gap-6 px-0! xl:gap-10"
        >
          <div className="shrink-0">
            <Logo />
          </div>
          <DesktopNav onDetailOpen={setDetailOpen} />
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 xl:gap-6">
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
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-white/70 lg:hidden"
            >
              <IconSearch width={24} height={24} />
            </Link>
            <SavedCarsLink />
            <CustomerFinanceControl />
            <div ref={menuWrapRef} className="relative lg:hidden">
              <IconButton
                label={menuOpen ? "Close menu" : "Open menu"}
                className="-mr-4 h-12! min-h-12! w-12! min-w-12!"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <IconClose width={24} height={24} />
                ) : (
                  <IconMenu width={24} height={24} />
                )}
              </IconButton>
              {menuOpen ? (
                <div
                  id={menuId}
                  role="dialog"
                  aria-label="Menu"
                  className="absolute top-full right-0 z-[var(--oak-z-dropdown)] mt-2 w-[min(calc(100vw-2*var(--oak-page-x)),16.5rem)] overflow-hidden rounded-[20px] border border-border bg-page shadow-[0_16px_40px_rgba(16,40,72,0.14)]"
                >
                  <div className="max-h-[min(70dvh,32rem)] overflow-y-auto p-3.5">
                    <MobileNav onNavigate={() => setMenuOpen(false)} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
