"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isVdpVariantSwitchEnabled,
  VDP_VARIANT_QUERY,
  VDP_VARIANT_STORAGE_KEY,
  type VdpLayoutVariant,
} from "@/lib/vdp/variant";

const VdpVariantContext = createContext<{
  variant: VdpLayoutVariant;
  setVariant: (next: VdpLayoutVariant) => void;
  switchEnabled: boolean;
} | null>(null);

function readStoredVariant(): VdpLayoutVariant | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.sessionStorage.getItem(VDP_VARIANT_STORAGE_KEY);
    if (stored === "2") {
      return 2;
    }
    if (stored === "1") {
      return 1;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function VdpVariantProvider({
  initialVariant,
  children,
}: {
  initialVariant: VdpLayoutVariant;
  children: ReactNode;
}) {
  const switchEnabled = isVdpVariantSwitchEnabled();
  const [variant, setVariantState] = useState<VdpLayoutVariant>(initialVariant);

  useEffect(() => {
    if (!switchEnabled) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(VDP_VARIANT_QUERY);
    if (fromQuery === "1" || fromQuery === "2") {
      setVariantState(fromQuery === "2" ? 2 : 1);
      return;
    }
    const stored = readStoredVariant();
    if (stored) {
      setVariantState(stored);
    }
  }, [switchEnabled]);

  const setVariant = useCallback(
    (next: VdpLayoutVariant) => {
      if (!switchEnabled) {
        return;
      }
      setVariantState(next);
      try {
        window.sessionStorage.setItem(VDP_VARIANT_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      const url = new URL(window.location.href);
      url.searchParams.set(VDP_VARIANT_QUERY, String(next));
      window.history.replaceState(null, "", url.toString());
    },
    [switchEnabled],
  );

  const value = useMemo(
    () => ({ variant: switchEnabled ? variant : 1, setVariant, switchEnabled }),
    [variant, setVariant, switchEnabled],
  );

  return (
    <VdpVariantContext.Provider value={value}>{children}</VdpVariantContext.Provider>
  );
}

export function useVdpVariant() {
  const ctx = useContext(VdpVariantContext);
  if (!ctx) {
    throw new Error("useVdpVariant must be used within VdpVariantProvider");
  }
  return ctx;
}
