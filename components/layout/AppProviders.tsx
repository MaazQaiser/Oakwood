"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { CustomerFinanceProvider } from "@/features/eligibility/CustomerFinanceProvider";
import { ConsentProvider } from "@/features/legal/components/ConsentProvider";
import { ConsentBanner } from "@/features/legal/components/ConsentBanner";
import { PrivacySettings } from "@/features/legal/components/PrivacySettings";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CustomerFinanceProvider>
      <ConsentProvider>
        <ToastProvider>{children}</ToastProvider>
        <ConsentBanner />
        <PrivacySettings />
      </ConsentProvider>
    </CustomerFinanceProvider>
  );
}
