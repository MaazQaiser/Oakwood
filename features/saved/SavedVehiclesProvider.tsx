"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { pruneSavedIds, SAVED_MAX, SAVED_STORAGE_KEY } from "@/lib/saved/catalog";

export type SavedToggleResult = {
  action: "added" | "removed" | "limit" | "ignored";
  stockIds: string[];
};

interface SavedVehiclesContextValue {
  stockIds: string[];
  count: number;
  ready: boolean;
  has: (stockId: string) => boolean;
  toggle: (stockId: string, category?: string) => SavedToggleResult;
}

const SavedVehiclesContext = createContext<SavedVehiclesContextValue | null>(null);

function readStoredIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return pruneSavedIds(parsed.filter((item) => typeof item === "string"));
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
}

export function SavedVehiclesProvider({ children }: { children: ReactNode }) {
  const [stockIds, setStockIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const persistReady = useRef(false);

  useEffect(() => {
    setStockIds(readStoredIds());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!persistReady.current) {
      persistReady.current = true;
      return;
    }
    writeStoredIds(stockIds);
  }, [ready, stockIds]);

  const toggle = useCallback((stockId: string, category?: string): SavedToggleResult => {
    let action: SavedToggleResult["action"] = "ignored";
    let nextIds: string[] = [];
    setStockIds((current) => {
      const pruned = pruneSavedIds(current);
      if (pruned.includes(stockId)) {
        action = "removed";
        nextIds = pruned.filter((id) => id !== stockId);
        return nextIds;
      }
      if (!pruneSavedIds([stockId]).includes(stockId)) {
        action = "ignored";
        nextIds = pruned;
        return pruned;
      }
      if (pruned.length >= SAVED_MAX) {
        action = "limit";
        nextIds = pruned;
        return pruned;
      }
      action = "added";
      nextIds = pruneSavedIds([stockId, ...pruned]);
      trackEvent(analyticsEvents.vehicleSaved, { stockId, category });
      trackEvent(analyticsEvents.saveVehicle, { stockId, category });
      return nextIds;
    });
    return { action, stockIds: nextIds };
  }, []);

  const value = useMemo(
    () => ({
      stockIds,
      count: stockIds.length,
      ready,
      has: (stockId: string) => stockIds.includes(stockId),
      toggle,
    }),
    [stockIds, ready, toggle],
  );

  return (
    <SavedVehiclesContext.Provider value={value}>
      {children}
    </SavedVehiclesContext.Provider>
  );
}

export function useSavedVehicles() {
  const context = useContext(SavedVehiclesContext);
  if (!context) {
    throw new Error("useSavedVehicles must be used within SavedVehiclesProvider");
  }
  return context;
}
