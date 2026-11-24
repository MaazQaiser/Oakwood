"use server";

import { saveSellOutrightLead } from "@/features/part-exchange/sell-outright-store";

export async function submitSellOutrightLeadAction(input: {
  name: string;
  email: string;
  mobile: string;
  registration: string;
  mileage?: string;
}): Promise<
  | { ok: true; id: string }
  | { ok: false; message: string }
> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const mobile = input.mobile.trim();
  const registration = input.registration.replace(/\s+/g, "").toUpperCase();
  if (name.length < 2) {
    return { ok: false, message: "Enter your name." };
  }
  if (!email.includes("@")) {
    return { ok: false, message: "Enter a valid email." };
  }
  if (mobile.replace(/\D/g, "").length < 10) {
    return { ok: false, message: "Enter a mobile number." };
  }
  if (registration.length < 5) {
    return { ok: false, message: "Enter the registration." };
  }
  const mileageRaw = input.mileage?.trim();
  const mileage = mileageRaw ? Number(mileageRaw) : undefined;
  if (mileageRaw && (!Number.isFinite(mileage) || (mileage ?? 0) < 0)) {
    return { ok: false, message: "Enter a valid mileage." };
  }

  const lead = saveSellOutrightLead({
    name,
    email,
    mobile,
    registration,
    mileage,
  });
  return { ok: true, id: lead.id };
}
