"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, IconButton } from "@/components/ui/Button";
import { IconClose, IconMenu } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { Logo } from "@/components/navigation/Logo";
import { MobileNav } from "@/components/navigation/MobileNav";
import { CustomerFinanceControl } from "@/components/finance/CustomerFinanceControl";
import { financeCta } from "@/config/navigation";
import { showrooms } from "@/config/locations";

const headerPhone = showrooms.find((item) => item.telephone)?.telephone;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (menuWrapRef.current && target && !menuWrapRef.current.contains(target)) {
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
    <div
      data-oak-header-shell=""
      data-elevated="true"
      className="sticky top-0 z-[var(--oak-z-header)] w-full bg-page pt-3 -mb-3 shadow-[0_1px_0_var(--oak-border),0_10px_28px_rgba(66,69,78,0.06)] lg:pt-4 lg:-mb-4"
    >
      <header className="relative px-[var(--oak-page-x)] lg:px-0">
        <Container
          width="wide"
          className="flex h-[var(--oak-header-height)] min-w-0 items-center gap-6 px-0! lg:px-[var(--oak-page-x)]! xl:gap-10"
        >
          <div className="min-w-0">
            <Logo className="max-w-full" />
          </div>
          <DesktopNav />
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-4">
            {headerPhone ? (
              <a
                href={`tel:${headerPhone.replace(/\s/g, "")}`}
                className="hidden text-[0.95rem] font-medium tracking-[-0.01em] text-ink no-underline min-[1380px]:inline"
              >
                {headerPhone}
              </a>
            ) : null}
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
                    <div className="mb-3" onClick={() => setMenuOpen(false)}>
                      <Button
                        href={financeCta.href}
                        className="btn-compact w-full justify-start"
                      >
                        {financeCta.anonymousLabel}
                      </Button>
                    </div>
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
