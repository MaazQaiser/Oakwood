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
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { COMPARE_MAX, COMPARE_STORAGE_KEY } from "@/lib/compare/copy";
import { pruneCompareIds } from "@/lib/compare/catalog";

export type CompareToggleResult = {
  action: "added" | "removed" | "replaced" | "ignored";
  stockIds: string[];
};

interface CompareContextValue {
  stockIds: string[];
  count: number;
  isFull: boolean;
  ready: boolean;
  has: (stockId: string) => boolean;
  toggle: (stockId: string) => CompareToggleResult;
  remove: (stockId: string) => void;
  clear: () => void;
  hydrateFromQuery: (ids: string[]) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function readStoredIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return pruneCompareIds(parsed.filter((item) => typeof item === "string"));
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [stockIds, setStockIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = readStoredIds();
    setStockIds(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    writeStoredIds(stockIds);
  }, [ready, stockIds]);

  const apply = useCallback((ids: string[]) => {
    setStockIds(pruneCompareIds(ids));
  }, []);

  const toggle = useCallback((stockId: string): CompareToggleResult => {
    let action: CompareToggleResult["action"] = "ignored";
    let nextIds: string[] = [];
    setStockIds((current) => {
      const pruned = pruneCompareIds(current);
      if (pruned.includes(stockId)) {
        action = "removed";
        nextIds = pruned.filter((id) => id !== stockId);
        trackEvent(analyticsEvents.compareVehicleRemoved, { stockId });
        return nextIds;
      }
      const candidate = pruneCompareIds([stockId]);
      if (candidate.length === 0) {
        action = "ignored";
        nextIds = pruned;
        return pruned;
      }
      if (pruned.length >= COMPARE_MAX) {
        action = "replaced";
        nextIds = pruneCompareIds([...pruned.slice(1), stockId]);
        trackEvent(analyticsEvents.compareVehicleAdded, {
          stockId,
          replaced: true,
        });
        return nextIds;
      }
      action = "added";
      nextIds = pruneCompareIds([...pruned, stockId]);
      trackEvent(analyticsEvents.compareVehicleAdded, { stockId });
      return nextIds;
    });
    return { action, stockIds: nextIds };
  }, []);

  const remove = useCallback((stockId: string) => {
    setStockIds((current) => {
      if (!current.includes(stockId)) {
        return current;
      }
      trackEvent(analyticsEvents.compareVehicleRemoved, { stockId });
      return current.filter((id) => id !== stockId);
    });
  }, []);

  const clear = useCallback(() => {
    setStockIds([]);
  }, []);

  const hydrateFromQuery = useCallback((ids: string[]) => {
    const next = pruneCompareIds(ids);
    if (next.length === 0) {
      return;
    }
    apply(next);
  }, [apply]);

  const value = useMemo(
    () => ({
      stockIds,
      count: stockIds.length,
      isFull: stockIds.length >= COMPARE_MAX,
      ready,
      has: (stockId: string) => stockIds.includes(stockId),
      toggle,
      remove,
      clear,
      hydrateFromQuery,
    }),
    [stockIds, ready, toggle, remove, clear, hydrateFromQuery],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
