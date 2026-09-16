import type { ReactNode } from "react";
import { EligibilityJourneyProvider } from "@/components/eligibility/EligibilityJourneyProvider";

export default function FinanceEligibilityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <EligibilityJourneyProvider>{children}</EligibilityJourneyProvider>;
}
