"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDealAction,
  createDealResumeLink,
} from "@/features/deal/actions";
import { getDealUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import { saveValuationEmailLead } from "@/features/part-exchange/actions";
import {
  VE_EMAIL_FAILED,
  VE_OTHER_REQUIRED,
  VE_SAVE_FAILED,
} from "@/lib/valuation-entry/copy";
import { mockPrefillExtras } from "@/lib/valuation-entry/extras";
import {
  mockLookupRegistration,
  vehicleToDealVehicle,
} from "@/lib/valuation-entry/mock";
import { valuePartExchangeVehicle } from "@/lib/part-exchange/valuation";
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
import type { PxIdentifiedVehicle, PxValuation } from "@/types/part-exchange";

export type VeStep =
  | "lookup"
  | "vehicle"
  | "manual"
  | "details"
  | "valuing"
  | "valuation-error"
  | "result"
  | "error";

export type VeDetailsErrors = {
  condition?: string;
  service?: string;
  plate?: string;
  other?: string;
  finance?: string;
  settlement?: string;
  lender?: string;
};

export type VeExitPanel = "none" | "email" | "save";

export function useValuationEntry({
  stockId,
  initialRegistration,
  initialMileage,
  cashDeposit,
  term,
  financeType,
  initialVehicle,
  onCloseRequest,
}: {
  stockId: string;
  initialRegistration: string;
  initialMileage: string;
  cashDeposit?: number;
  term?: number;
  financeType?: "hp" | "pcp";
  initialVehicle?: PxIdentifiedVehicle;
  onCloseRequest: (opts: { fromResult: boolean }) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<VeStep>(initialVehicle ? "vehicle" : "lookup");
  const [registration, setRegistration] = useState(
    normaliseRegistration(initialRegistration),
  );
  const [mileage, setMileage] = useState(initialMileage);
  const [vehicle, setVehicle] = useState<PxIdentifiedVehicle | undefined>(
    initialVehicle,
  );
  const [lookupError, setLookupError] = useState<string>();
  const [condition, setCondition] = useState<DealPxCondition>();
  const [serviceHistory, setServiceHistory] = useState<DealPxServiceHistory>();
  const [extras, setExtras] = useState<DealPxExtraId[]>(
    initialVehicle ? mockPrefillExtras(initialRegistration) : [],
  );
  const [privatePlateDisposition, setPrivatePlateDisposition] =
    useState<DealPxPrivatePlateDisposition>();
  const [otherNotes, setOtherNotes] = useState("");
  const [financeOutstanding, setFinanceOutstanding] = useState<boolean>();
  const [settlement, setSettlement] = useState("");
  const [lender, setLender] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [valuation, setValuation] = useState<PxValuation>();
  const [valuationError, setValuationError] = useState<string>();
  const [detailsErrors, setDetailsErrors] = useState<VeDetailsErrors>({});
  const [exitPanel, setExitPanel] = useState<VeExitPanel>("none");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [phoneError, setPhoneError] = useState<string>();
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
  const stepRef = useRef(step);
  const onCloseRequestRef = useRef(onCloseRequest);
  stepRef.current = step;
  onCloseRequestRef.current = onCloseRequest;

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
    if (initialVehicle) {
      return;
    }
    void runLookup(normaliseRegistration(initialRegistration));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once on mount with card values
  }, []);

  useEffect(() => {
    if (step === "result" && resultReadyAt.current === null) {
      resultReadyAt.current = Date.now();
    }
  }, [step]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!historyPushed.current) {
      historyPushed.current = true;
      window.history.pushState({ veFlow: true }, "");
    }
    const onPop = () => {
      onCloseRequestRef.current({
        fromResult: stepRef.current === "result",
      });
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  function canTriggerAbandon(): boolean {
    if (step !== "result" || resultReadyAt.current === null) {
      return false;
    }
    return Date.now() - resultReadyAt.current >= 2000;
  }

  function goBack() {
    setFieldError(undefined);
    if (step === "result" || step === "valuation-error" || step === "valuing") {
      setStep("details");
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
    if (step === "details") {
      setStep(vehicle?.source === "manual" ? "manual" : "vehicle");
    }
  }

  async function confirmVehicle() {
    if (!vehicle) {
      return;
    }
    setStep("details");
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
    setStep("details");
  }

  function validateDetails(): boolean {
    const next: VeDetailsErrors = {};
    if (!condition) {
      next.condition = "Choose a condition.";
    }
    if (!serviceHistory) {
      next.service = "Choose a service history option.";
    }
    if (extras.includes("private-plate") && !privatePlateDisposition) {
      next.plate = "Tell us whether you want to keep or sell the private plate.";
    }
    if (extras.includes("other") && otherNotes.trim().length === 0) {
      next.other = VE_OTHER_REQUIRED;
    }
    if (financeOutstanding === undefined) {
      next.finance = "Tell us if you still have finance on this car.";
    } else if (financeOutstanding) {
      const settlementMessage = settlementError(settlement);
      if (settlementMessage) {
        next.settlement = settlementMessage;
      }
      if (lender.trim().length === 0) {
        next.lender = "Enter the finance lender.";
      }
    }
    setDetailsErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submitDetails() {
    if (miles === undefined) {
      setFieldError("Enter the current mileage.");
      return;
    }
    if (!validateDetails()) {
      return;
    }
    setFieldError(undefined);
    setValuationError(undefined);
    setStep("valuing");
    trackEvent(analyticsEvents.pxValuationRequested, {
      source: "entry_hook",
      stockId,
    });
    await new Promise((resolve) => {
      window.setTimeout(resolve, 400);
    });
    const result = valuePartExchangeVehicle({
      registration,
      mileage: miles,
      valuationDate: new Date().toISOString().slice(0, 10),
    });
    if (!result.ok) {
      setValuation(undefined);
      setValuationError(result.message);
      setStep("valuation-error");
      trackEvent(analyticsEvents.pxValuationFailed, {
        source: "entry_hook",
        stockId,
        reason: result.reason,
      });
      return;
    }
    setValuation(result.valuation);
    setStep("result");
    trackEvent(analyticsEvents.pxValuationReceived, {
      source: "entry_hook",
      stockId,
      value: result.valuation.estimatedValue,
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
    router.push(getDealUrl(result.dealId, "budget"));
  }

  async function requestCallback() {
    const px = toDealPx();
    if (!px) {
      return;
    }
    setBusy(true);
    const result = await createDealAction({
      stockId,
      cashDeposit,
      term,
      financeType,
      px,
    });
    setBusy(false);
    if (!result.ok) {
      setFieldError("We couldn't start your callback. Please try again.");
      return;
    }
    router.push(`${getDealUrl(result.dealId, "reserve")}?panel=callback`);
  }

  async function submitEmail() {
    const message = emailError(email);
    if (message) {
      setFieldError(message);
      return;
    }
    const px = toDealPx();
    if (!px) {
      setFieldError("Complete the valuation before sending it.");
      return;
    }
    setFieldError(undefined);
    setBusy(true);
    const result = await saveValuationEmailLead({
      email,
      stockId,
      px,
    });
    setBusy(false);
    if (!result.ok) {
      setFieldError(VE_EMAIL_FAILED);
      return;
    }
    setEmailSent(true);
    trackEvent(analyticsEvents.dealSaved, {
      source: "entry_hook",
      path: "email_valuation",
    });
  }

  async function submitSave() {
    const message = emailError(email);
    const mobileMessage = phone.trim() ? telephoneError(phone) : undefined;
    setFieldError(message);
    setPhoneError(mobileMessage);
    if (message || mobileMessage) {
      return;
    }
    const px = toDealPx();
    if (!px) {
      setFieldError("Complete the valuation before saving.");
      return;
    }
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
      setFieldError(VE_SAVE_FAILED);
      return;
    }
    const resume = await createDealResumeLink({
      dealId: deal.dealId,
      email,
      phone,
    });
    setBusy(false);
    if (!resume.ok) {
      setFieldError(VE_SAVE_FAILED);
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
    valuationError,
    detailsErrors,
    setDetailsErrors,
    exitPanel,
    setExitPanel,
    email,
    setEmail,
    phone,
    setPhone,
    emailSent,
    phoneError,
    setPhoneError,
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
    submitDetails,
    continueToDeal,
    requestCallback,
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
