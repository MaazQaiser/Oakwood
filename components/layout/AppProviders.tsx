"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CompareProvider } from "@/features/compare/CompareProvider";
import { SavedVehiclesProvider } from "@/features/saved/SavedVehiclesProvider";
import { CustomerFinanceProvider } from "@/features/eligibility/CustomerFinanceProvider";
import type { CustomerFinanceSeed } from "@/features/eligibility/finance-seed-types";
import { ConsentProvider } from "@/features/legal/components/ConsentProvider";
import { ConsentBanner } from "@/features/legal/components/ConsentBanner";
import { PrivacySettings } from "@/features/legal/components/PrivacySettings";

export function AppProviders({
  children,
  initialFinance = null,
}: {
  children: ReactNode;
  initialFinance?: CustomerFinanceSeed | null;
}) {
  return (
    <CustomerFinanceProvider initialProfile={initialFinance}>
      <ConsentProvider>
        <ToastProvider>
          <CompareProvider>
            <SavedVehiclesProvider>{children}</SavedVehiclesProvider>
          </CompareProvider>
        </ToastProvider>
        <ConsentBanner />
        <PrivacySettings />
      </ConsentProvider>
    </CustomerFinanceProvider>
  );
}
