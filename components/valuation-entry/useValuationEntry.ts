"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDealAction,
  createDealResumeLink,
} from "@/features/deal/actions";
import { getDealUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { mockPrefillExtras } from "@/lib/valuation-entry/extras";
import {
  mockCalculateValuation,
  mockLookupRegistration,
  vehicleToDealVehicle,
  type VeMockValuation,
} from "@/lib/valuation-entry/mock";
import {
  mileageError,
  normaliseRegistration,
  parseMileage,
  parsePounds,
  registrationError,
  settlementError,
} from "@/lib/part-exchange/validation";
import type {
  DealPartExchangeInput,
  DealPxCondition,
  DealPxExtraId,
  DealPxPrivatePlateDisposition,
  DealPxServiceHistory,
} from "@/types/deal";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

export type VeStep =
  | "lookup"
  | "vehicle"
  | "manual"
  | "condition"
  | "service"
  | "extras"
  | "finance"
  | "valuing"
  | "result"
  | "error";

export type VeExitPanel = "none" | "email" | "save";

export function useValuationEntry({
  stockId,
  initialRegistration,
  initialMileage,
  cashDeposit,
  term,
  financeType,
  onCloseRequest,
}: {
  stockId: string;
  initialRegistration: string;
  initialMileage: string;
  cashDeposit?: number;
  term?: number;
  financeType?: "hp" | "pcp";
  onCloseRequest: (opts: { fromResult: boolean }) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<VeStep>("lookup");
  const [registration, setRegistration] = useState(
    normaliseRegistration(initialRegistration),
  );
  const [mileage, setMileage] = useState(initialMileage);
  const [vehicle, setVehicle] = useState<PxIdentifiedVehicle>();
  const [lookupError, setLookupError] = useState<string>();
  const [condition, setCondition] = useState<DealPxCondition>();
  const [serviceHistory, setServiceHistory] = useState<DealPxServiceHistory>();
  const [extras, setExtras] = useState<DealPxExtraId[]>([]);
  const [privatePlateDisposition, setPrivatePlateDisposition] =
    useState<DealPxPrivatePlateDisposition>();
  const [otherNotes, setOtherNotes] = useState("");
  const [financeOutstanding, setFinanceOutstanding] = useState<boolean>();
  const [settlement, setSettlement] = useState("");
  const [lender, setLender] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [valuation, setValuation] = useState<VeMockValuation>();
  const [exitPanel, setExitPanel] = useState<VeExitPanel>("none");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState({
    year: "",
    make: "",
    model: "",
    variant: "",
    fuelType: "Petrol",
    transmission: "Manual",
  });
  const resultReadyAt = useRef<number | null>(null);
  const historyPushed = useRef(false);

  const miles = parseMileage(mileage);

  const toDealPx = useCallback((): DealPartExchangeInput | undefined => {
    if (!valuation || miles === undefined) {
      return undefined;
    }
    const settlementAmount =
      financeOutstanding === true ? parsePounds(settlement) : undefined;
    return {
      registration: normaliseRegistration(registration),
      mileage: miles,
      value: valuation.estimatedValue,
      settlement:
        financeOutstanding === true ? settlementAmount ?? 0 : undefined,
      vehicle: vehicle ? vehicleToDealVehicle(vehicle) : undefined,
      financeOutstanding,
      outstandingFinanceAmount: settlementAmount,
      outstandingFinanceLender:
        financeOutstanding === true ? lender || undefined : undefined,
      condition,
      serviceHistory,
      extras: {
        selected: extras,
        privatePlateDisposition: extras.includes("private-plate")
          ? privatePlateDisposition
          : undefined,
        otherNotes: extras.includes("other") ? otherNotes || undefined : undefined,
      },
      valuationDate: valuation.valuationDate,
      deductions: valuation.deductions,
    };
  }, [
    condition,
    extras,
    financeOutstanding,
    lender,
    miles,
    otherNotes,
    privatePlateDisposition,
    registration,
    serviceHistory,
    settlement,
    valuation,
    vehicle,
  ]);

  const runLookup = useCallback(async (reg: string) => {
    setStep("lookup");
    setLookupError(undefined);
    setVehicle(undefined);
    trackEvent(analyticsEvents.pxRegistrationSubmitted, {
      source: "entry_hook",
      stockId,
    });
    const result = await mockLookupRegistration(reg);
    if (!result.ok) {
      setLookupError(result.message);
      setStep("error");
      trackEvent(analyticsEvents.pxRegistrationFailed, {
        source: "entry_hook",
        reason: result.reason,
      });
      return;
    }
    setVehicle(result.vehicle);
    setExtras(mockPrefillExtras(reg));
    setStep("vehicle");
    trackEvent(analyticsEvents.pxRegistrationSuccess, {
      source: "entry_hook",
      stockId,
    });
  }, [stockId]);

  useEffect(() => {
    void runLookup(normaliseRegistration(initialRegistration));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once on mount with card values
  }, []);

  useEffect(() => {
    if (step === "result" && resultReadyAt.current === null) {
      resultReadyAt.current = Date.now();
    }
  }, [step]);

  useEffect(() => {
    if (typeof window === "undefined" || historyPushed.current) {
      return;
    }
    historyPushed.current = true;
    window.history.pushState({ veFlow: true }, "");
    const onPop = () => {
      onCloseRequest({ fromResult: step === "result" });
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, [onCloseRequest, step]);

  function canTriggerAbandon(): boolean {
    if (step !== "result" || resultReadyAt.current === null) {
      return false;
    }
    return Date.now() - resultReadyAt.current >= 2000;
  }

  function goBack() {
    setFieldError(undefined);
    if (step === "result") {
      setStep("finance");
      return;
    }
    if (step === "error" || step === "vehicle" || step === "lookup") {
      onCloseRequest({ fromResult: false });
      return;
    }
    if (step === "manual") {
      setStep(vehicle ? "vehicle" : "error");
      return;
    }
    if (step === "condition") {
      setStep("vehicle");
      return;
    }
    if (step === "service") {
      setStep("condition");
      return;
    }
    if (step === "extras") {
      setStep("service");
      return;
    }
    if (step === "finance" || step === "valuing") {
      setStep("extras");
    }
  }

  async function confirmVehicle() {
    if (!vehicle) {
      return;
    }
    setStep("condition");
  }

  function saveManual() {
    const year = Number(manual.year);
    if (
      !manual.make.trim() ||
      !manual.model.trim() ||
      !Number.isInteger(year) ||
      year < 1980 ||
      year > 2026
    ) {
      setFieldError("Enter a valid year, make and model.");
      return;
    }
    setFieldError(undefined);
    setVehicle({
      year,
      make: manual.make.trim(),
      model: manual.model.trim(),
      variant: manual.variant.trim() || undefined,
      fuelType: manual.fuelType,
      transmission: manual.transmission,
      source: "manual",
    });
    setStep("condition");
  }

  function continueCondition() {
    if (!condition) {
      setFieldError("Choose a condition.");
      return;
    }
    setFieldError(undefined);
    setStep("service");
  }

  function continueService() {
    if (!serviceHistory) {
      setFieldError("Choose a service history option.");
      return;
    }
    setFieldError(undefined);
    setStep("extras");
  }

  function continueExtras() {
    if (extras.includes("private-plate") && !privatePlateDisposition) {
      setFieldError("Tell us whether you want to keep or sell the private plate.");
      return;
    }
    setFieldError(undefined);
    setStep("finance");
  }

  async function continueFinance() {
    if (financeOutstanding === undefined) {
      setFieldError("Tell us if you still have finance on this car.");
      return;
    }
    if (financeOutstanding) {
      const err = settlementError(settlement);
      if (err) {
        setFieldError(err);
        return;
      }
    }
    setFieldError(undefined);
    setStep("valuing");
    trackEvent(analyticsEvents.pxValuationRequested, {
      source: "entry_hook",
      stockId,
    });
    const result = await mockCalculateValuation({
      registration,
      mileage: miles ?? 0,
      condition,
      serviceHistory,
      extras,
    });
    setValuation(result);
    setStep("result");
    trackEvent(analyticsEvents.pxValuationReceived, {
      source: "entry_hook",
      stockId,
      value: result.estimatedValue,
    });
  }

  function toggleExtra(id: DealPxExtraId) {
    setExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function continueToDeal() {
    const px = toDealPx();
    if (!px) {
      return;
    }
    setBusy(true);
    trackEvent(analyticsEvents.dealStarted, {
      source: "entry_hook",
      stockId,
    });
    const result = await createDealAction({
      stockId,
      cashDeposit,
      term,
      financeType,
      px,
    });
    if (!result.ok) {
      setBusy(false);
      setFieldError("We couldn't start your deal. Please try again.");
      return;
    }
    // Spec §3: Continue from entry valuation lands on Step 2 with PX prefilled.
    router.push(getDealUrl(result.dealId, "budget"));
  }

  function submitEmail() {
    if (!email.includes("@")) {
      setFieldError("Enter a valid email address.");
      return;
    }
    setFieldError(undefined);
    setEmailSent(true);
    trackEvent(analyticsEvents.dealSaved, {
      source: "entry_hook",
      path: "email_valuation",
    });
  }

  async function submitSave() {
    if (!email.includes("@")) {
      setFieldError("Enter a valid email address.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setFieldError("Enter a valid UK mobile number.");
      return;
    }
    const px = toDealPx();
    if (!px) {
      setFieldError("Complete the valuation before saving.");
      return;
    }
    setFieldError(undefined);
    setBusy(true);
    const deal = await createDealAction({
      stockId,
      cashDeposit,
      term,
      financeType,
      px,
    });
    if (!deal.ok) {
      setBusy(false);
      setFieldError("We couldn't save your progress. Please try again.");
      return;
    }
    const resume = await createDealResumeLink({
      dealId: deal.dealId,
      email,
      phone,
    });
    setBusy(false);
    if (!resume.ok) {
      setFieldError("We couldn't create a resume link. Please try again.");
      return;
    }
    setResumeLink(resume.resumePath);
    setSaved(true);
    trackEvent(analyticsEvents.dealSaved, {
      source: "entry_hook",
      path: "saved_resumable",
    });
  }

  return {
    step,
    registration,
    setRegistration,
    mileage,
    setMileage,
    vehicle,
    setVehicle,
    lookupError,
    condition,
    setCondition,
    serviceHistory,
    setServiceHistory,
    extras,
    toggleExtra,
    privatePlateDisposition,
    setPrivatePlateDisposition,
    otherNotes,
    setOtherNotes,
    financeOutstanding,
    setFinanceOutstanding,
    settlement,
    setSettlement,
    lender,
    setLender,
    fieldError,
    setFieldError,
    valuation,
    exitPanel,
    setExitPanel,
    email,
    setEmail,
    phone,
    setPhone,
    emailSent,
    saved,
    resumeLink,
    busy,
    manual,
    setManual,
    miles,
    goBack,
    runLookup,
    confirmVehicle,
    saveManual,
    continueCondition,
    continueService,
    continueExtras,
    continueFinance,
    continueToDeal,
    submitEmail,
    submitSave,
    canTriggerAbandon,
    toDealPx,
    enterManual: () => {
      setStep("manual");
      setFieldError(undefined);
    },
    retryLookup: () => {
      const regErr = registrationError(registration);
      const mileErr = mileageError(mileage);
      if (regErr || mileErr) {
        setFieldError(regErr ?? mileErr);
        return;
      }
      void runLookup(normaliseRegistration(registration));
    },
  };
}
