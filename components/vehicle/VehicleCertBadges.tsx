import { guaranteeCopy } from "@/lib/guarantee/copy";
import { isVehicleGuaranteeEligible } from "@/lib/guarantee/eligibility";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleCertBadges({ vehicle }: { vehicle: VehicleDetail }) {
  const badges = [
    isVehicleGuaranteeEligible(vehicle)
      ? {
          mark: "30D",
          title: "30 Day Guarantee",
          detail: guaranteeCopy.proofDetail,
        }
      : null,
    vehicle.inspection.available
      ? {
          mark: "AA",
          title: vehicle.inspection.result
            ? `AA ${vehicle.inspection.result}`
            : "AA Inspected",
          detail: vehicle.inspection.summary,
        }
      : null,
    vehicle.batteryHealth?.certificateAvailable
      ? {
          mark: "AV",
          title:
            vehicle.batteryHealth.stateOfHealthPercent !== undefined
              ? `Aviloo ${vehicle.batteryHealth.stateOfHealthPercent}%`
              : "Aviloo tested",
          detail:
            vehicle.batteryHealth.stateOfHealthPercent !== undefined
              ? `Battery state of health ${vehicle.batteryHealth.stateOfHealthPercent}%`
              : vehicle.batteryHealth.summary,
        }
      : null,
    {
      mark: "HPI",
      title:
        vehicle.provenance.outstandingFinance === "clear"
          ? "HPI Clear"
          : "HPI checked",
      detail:
        vehicle.provenance.outstandingFinance === "clear"
          ? "Clear finance and write-off check"
          : "Provenance recorded — see paperwork",
    },
    {
      mark: "MOT",
      title: `MOT ${vehicle.mot.latestResult}`,
      detail: `Valid until ${vehicle.motStatus.validUntil}`,
    },
  ].filter(Boolean) as Array<{
    mark: string;
    title: string;
    detail: string;
  }>;

  return (
    <ul
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Certificates"
    >
      {badges.map((badge) => (
        <li
          key={badge.mark}
          className="flex min-h-[3.75rem] items-center gap-2.5 rounded-[14px] bg-white px-2.5 py-2 shadow-[0_6px_18px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4]"
        >
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-[#002852] text-[0.65rem] font-bold tracking-wide text-white"
          >
            {badge.mark}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.78rem] font-semibold leading-tight text-ink">
              {badge.title}
            </span>
            <span className="mt-0.5 block truncate text-[0.68rem] leading-snug text-muted">
              {badge.detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
