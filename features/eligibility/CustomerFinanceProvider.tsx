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
import { getEligibilityUiState } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export type CustomerFinanceMode =
  | "anonymous"
  | "personalised"
  | "ineligible";

export interface EligibilityProfileInput {
  mode: CustomerFinanceMode;
  apr: number;
  maxAdvance: number;
  deposit: number;
  term: number;
}

interface CustomerFinanceUi {
  mode: CustomerFinanceMode;
  apr: number;
  maxAdvance: number;
  deposit: number;
  term: number;
  assumptionsOpen: boolean;
  setMode: (mode: CustomerFinanceMode) => void;
  setDeposit: (value: number) => void;
  setTerm: (value: number) => void;
  setAssumptionsOpen: (open: boolean) => void;
  applyEligibilityProfile: (input: EligibilityProfileInput) => void;
}

const CustomerFinanceContext = createContext<CustomerFinanceUi | null>(null);

export function CustomerFinanceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CustomerFinanceMode>("anonymous");
  const [apr, setApr] = useState(16.9);
  const [maxAdvance, setMaxAdvance] = useState(26500);
  const [deposit, setDeposit] = useState(1000);
  const [term, setTerm] = useState(48);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const hydrated = useRef(false);

  const setModeSafe = useCallback((next: CustomerFinanceMode) => {
    setMode(next);
  }, []);

  const applyEligibilityProfile = useCallback((input: EligibilityProfileInput) => {
    setMode(input.mode);
    setApr(input.apr);
    setMaxAdvance(input.maxAdvance);
    setDeposit(input.deposit);
    setTerm(input.term);
    trackEvent(analyticsEvents.financeProfileUpdated);
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      return;
    }
    hydrated.current = true;

    void getEligibilityUiState().then((state) => {
      if (state.status !== "complete" || !state.display) {
        return;
      }
      if (
        state.profileExpiry &&
        Date.parse(state.profileExpiry) <= Date.now()
      ) {
        return;
      }
      if (state.outcome === "accepted" || state.outcome === "conditional") {
        applyEligibilityProfile({
          mode: "personalised",
          apr: state.display.apr,
          maxAdvance: state.display.maxAdvance,
          deposit: state.display.deposit,
          term: state.display.term,
        });
      }
    });
  }, [applyEligibilityProfile]);

  const value = useMemo(
    () => ({
      mode,
      apr,
      maxAdvance,
      deposit,
      term,
      assumptionsOpen,
      setMode: setModeSafe,
      setDeposit,
      setTerm,
      setAssumptionsOpen,
      applyEligibilityProfile,
    }),
    [
      mode,
      apr,
      maxAdvance,
      deposit,
      term,
      assumptionsOpen,
      setModeSafe,
      applyEligibilityProfile,
    ],
  );

  return (
    <CustomerFinanceContext.Provider value={value}>
      {children}
    </CustomerFinanceContext.Provider>
  );
}

export function useCustomerFinance() {
  const context = useContext(CustomerFinanceContext);
  if (!context) {
    throw new Error(
      "useCustomerFinance must be used within CustomerFinanceProvider",
    );
  }
  return context;
}
