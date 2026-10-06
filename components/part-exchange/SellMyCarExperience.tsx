"use client";

import { PxStandalone } from "@/components/part-exchange/PxFlow";

export function SellMyCarExperience({
  initialRegistration,
}: {
  initialRegistration?: string;
}) {
  return <PxStandalone initialRegistration={initialRegistration} />;
}
