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
import {
  ILLUSTRATION_BASE_DEPOSIT,
  ILLUSTRATION_BASE_TERM,
} from "@/lib/finance/illustration";

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
  profileTerm: number | null;
  profileDeposit: number | null;
  setMode: (mode: CustomerFinanceMode) => void;
  setDeposit: (value: number) => void;
  setTerm: (value: number) => void;
  setAssumptionsOpen: (open: boolean) => void;
  applyEligibilityProfile: (input: EligibilityProfileInput) => void;
}

const CustomerFinanceContext = createContext<CustomerFinanceUi | null>(null);

const ASSUMPTION_TERM_MIN = 24;
const ASSUMPTION_TERM_MAX = 60;
const ASSUMPTION_TERM_STEP = 6;

function normaliseAssumptionTerm(months: number): number {
  const fallback = ILLUSTRATION_BASE_TERM;
  const value = Number.isFinite(months) && months > 0 ? months : fallback;
  const clamped = Math.min(
    ASSUMPTION_TERM_MAX,
    Math.max(ASSUMPTION_TERM_MIN, Math.round(value)),
  );
  const stepped =
    Math.round((clamped - ASSUMPTION_TERM_MIN) / ASSUMPTION_TERM_STEP) *
      ASSUMPTION_TERM_STEP +
    ASSUMPTION_TERM_MIN;
  return Math.min(ASSUMPTION_TERM_MAX, stepped);
}

export function CustomerFinanceProvider({
  children,
  initialProfile = null,
}: {
  children: ReactNode;
  initialProfile?: EligibilityProfileInput | null;
}) {
  const [mode, setMode] = useState<CustomerFinanceMode>(
    initialProfile?.mode ?? "anonymous",
  );
  const [apr, setApr] = useState(initialProfile?.apr ?? 16.9);
  const [maxAdvance, setMaxAdvance] = useState(initialProfile?.maxAdvance ?? 26500);
  const [deposit, setDeposit] = useState(
    initialProfile?.deposit ?? ILLUSTRATION_BASE_DEPOSIT,
  );
  const [term, setTerm] = useState(
    initialProfile
      ? normaliseAssumptionTerm(initialProfile.term)
      : ILLUSTRATION_BASE_TERM,
  );
  const [assumptionsOpen, setAssumptionsOpenState] = useState(false);
  const [profileTerm, setProfileTerm] = useState<number | null>(
    initialProfile ? normaliseAssumptionTerm(initialProfile.term) : null,
  );
  const [profileDeposit, setProfileDeposit] = useState<number | null>(
    initialProfile?.deposit ?? null,
  );
  const hydrated = useRef(false);

  const setModeSafe = useCallback((next: CustomerFinanceMode) => {
    setMode(next);
  }, []);

  const applyEligibilityProfile = useCallback((input: EligibilityProfileInput) => {
    const nextDeposit = input.deposit || ILLUSTRATION_BASE_DEPOSIT;
    const nextTerm = normaliseAssumptionTerm(input.term);
    setMode(input.mode);
    setApr(input.apr);
    setMaxAdvance(input.maxAdvance);
    setProfileDeposit(nextDeposit);
    setProfileTerm(nextTerm);
    setDeposit(nextDeposit);
    setTerm(nextTerm);
    trackEvent(analyticsEvents.financeProfileUpdated);
  }, []);

  const setTermSafe = useCallback((value: number) => {
    setTerm(normaliseAssumptionTerm(value));
  }, []);

  const setAssumptionsOpen = useCallback(
    (open: boolean) => {
      if (open) {
        // 24 months is the first stop. Opening there looks unset, so use the
        // saved profile term, or the 48-month illustration when nothing longer is set.
        setTerm((current) => {
          const saved = profileTerm ?? current;
          const next = normaliseAssumptionTerm(saved);
          return next <= ASSUMPTION_TERM_MIN ? ILLUSTRATION_BASE_TERM : next;
        });
        if (
          (mode === "personalised" || mode === "ineligible") &&
          profileDeposit !== null
        ) {
          setDeposit(profileDeposit);
        }
      }
      setAssumptionsOpenState(open);
    },
    [mode, profileDeposit, profileTerm],
  );

  useEffect(() => {
    if (hydrated.current || initialProfile) {
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
      profileTerm,
      profileDeposit,
      setMode: setModeSafe,
      setDeposit,
      setTerm: setTermSafe,
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
      profileTerm,
      profileDeposit,
      setModeSafe,
      setTermSafe,
      setAssumptionsOpen,
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
