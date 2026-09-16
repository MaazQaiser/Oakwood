import { analyticsEvents } from "@/lib/analytics";
import type { VehicleCategory } from "@/types/vehicle";

export function getVanSearchEvents(category: VehicleCategory) {
  if (category !== "van") {
    return null;
  }

  return {
    viewed: analyticsEvents.usedVansViewed,
    searchStarted: analyticsEvents.vanSearchStarted,
    filterApplied: analyticsEvents.vanFilterApplied,
    filterRemoved: analyticsEvents.vanFilterRemoved,
    sortChanged: analyticsEvents.vanSortChanged,
    resultClicked: analyticsEvents.vanResultClicked,
    saved: analyticsEvents.vanSaved,
    zeroResults: analyticsEvents.vanZeroResults,
    requestStarted: analyticsEvents.vanRequestStarted,
    financeClicked: analyticsEvents.vanFinanceClicked,
    eligibilityClicked: analyticsEvents.vanEligibilityClicked,
  };
}
