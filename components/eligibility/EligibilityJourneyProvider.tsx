"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import type {
  EligibilityAnswers,
  EligibilityMachineState,
  EligibilityOutcomeKind,
  EligibilityQuestionId,
  EligibilityResultDisplay,
  EligibilityUiState,
} from "@/types/eligibility";

interface EligibilityJourneyValue {
  answers: EligibilityAnswers;
  questionId: EligibilityQuestionId;
  machine: EligibilityMachineState;
  outcome?: EligibilityOutcomeKind;
  display?: EligibilityResultDisplay;
  emailSent: boolean;
  setAnswers: (answers: EligibilityAnswers) => void;
  setQuestionId: (id: EligibilityQuestionId) => void;
  setMachine: (state: EligibilityMachineState) => void;
  applyUiState: (state: EligibilityUiState) => void;
  resetJourney: () => void;
}

const EligibilityJourneyContext = createContext<EligibilityJourneyValue | null>(
  null,
);

const INITIAL_QUESTION: EligibilityQuestionId = "employment";

export function EligibilityJourneyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const finance = useCustomerFinance();
  const [answers, setAnswers] = useState<EligibilityAnswers>({
    deposit: finance.deposit,
  });
  const [questionId, setQuestionId] =
    useState<EligibilityQuestionId>(INITIAL_QUESTION);
  const [machine, setMachine] = useState<EligibilityMachineState>("INTRO");
  const [outcome, setOutcome] = useState<EligibilityOutcomeKind>();
  const [display, setDisplay] = useState<EligibilityResultDisplay>();
  const [emailSent, setEmailSent] = useState(false);

  const applyUiState = useCallback((state: EligibilityUiState) => {
    setAnswers(state.answers);
    if (state.questionId) {
      setQuestionId(state.questionId);
    }
    setOutcome(state.outcome);
    setDisplay(state.display);
    if (state.status === "expired") {
      setMachine("EXPIRED");
      return;
    }
    if (state.status === "complete") {
      if (state.outcome === "accepted") setMachine("RESULT_ACCEPTED");
      else if (state.outcome === "conditional") setMachine("RESULT_CONDITIONAL");
      else if (state.outcome === "refer") setMachine("RESULT_REFER");
      else if (state.outcome === "alternative") setMachine("RESULT_ALTERNATIVE");
      else if (state.outcome === "error") setMachine("ERROR");
      setEmailSent(true);
      return;
    }
    if (Object.keys(state.answers).length > 0) {
      setMachine("QUESTION");
    }
  }, []);

  const resetJourney = useCallback(() => {
    setAnswers({ deposit: finance.deposit });
    setQuestionId(INITIAL_QUESTION);
    setMachine("INTRO");
    setOutcome(undefined);
    setDisplay(undefined);
    setEmailSent(false);
  }, [finance.deposit]);

  const value = useMemo(
    () => ({
      answers,
      questionId,
      machine,
      outcome,
      display,
      emailSent,
      setAnswers,
      setQuestionId,
      setMachine,
      applyUiState,
      resetJourney,
    }),
    [
      answers,
      questionId,
      machine,
      outcome,
      display,
      emailSent,
      applyUiState,
      resetJourney,
    ],
  );

  return (
    <EligibilityJourneyContext.Provider value={value}>
      {children}
    </EligibilityJourneyContext.Provider>
  );
}

export function useEligibilityJourney() {
  const context = useContext(EligibilityJourneyContext);
  if (!context) {
    throw new Error(
      "useEligibilityJourney must be used within EligibilityJourneyProvider",
    );
  }
  return context;
}
