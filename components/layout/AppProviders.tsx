"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CompareProvider } from "@/features/compare/CompareProvider";
import { CustomerFinanceProvider } from "@/features/eligibility/CustomerFinanceProvider";
import { ConsentProvider } from "@/features/legal/components/ConsentProvider";
import { ConsentBanner } from "@/features/legal/components/ConsentBanner";
import { PrivacySettings } from "@/features/legal/components/PrivacySettings";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CustomerFinanceProvider>
      <ConsentProvider>
        <ToastProvider>
          <CompareProvider>{children}</CompareProvider>
        </ToastProvider>
        <ConsentBanner />
        <PrivacySettings />
      </ConsentProvider>
    </CustomerFinanceProvider>
  );
}
