import { NextResponse } from "next/server";
import { getDealUrl } from "@/config/routes";
import { createDealAction } from "@/features/deal/actions";
import type { FinanceProductType } from "@/types/finance";

function sameOriginBack(request: Request, reason: string): URL {
  const current = new URL(request.url);
  let target = new URL("/", current.origin);
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const candidate = new URL(referer);
      if (candidate.origin === current.origin) {
        target = candidate;
      }
    } catch {
      // Keep the homepage fallback.
    }
  }
  target.searchParams.set("dealError", reason);
  return target;
}

function numberOrUndefined(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Stable start URL. A server action id changes on every deploy, so a page
 * that is already open fails with "We couldn't open your deal."
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const stockId = String(form.get("stockId") ?? "");
  const financeTypeRaw = String(form.get("financeType") ?? "");
  const financeType: FinanceProductType | undefined =
    financeTypeRaw === "hp" || financeTypeRaw === "pcp"
      ? financeTypeRaw
      : undefined;

  try {
    const result = await createDealAction({
      stockId,
      cashDeposit: numberOrUndefined(form.get("cashDeposit")),
      term: numberOrUndefined(form.get("term")),
      financeType,
      annualMileage: numberOrUndefined(form.get("annualMileage")),
    });
    if (!result.ok) {
      return NextResponse.redirect(sameOriginBack(request, result.reason), 303);
    }
    return NextResponse.redirect(
      new URL(getDealUrl(result.dealId, "part-exchange"), request.url),
      303,
    );
  } catch (error) {
    console.error("deal start failed", error);
    return NextResponse.redirect(sameOriginBack(request, "error"), 303);
  }
}
