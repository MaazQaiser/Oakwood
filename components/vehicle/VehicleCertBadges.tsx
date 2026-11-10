import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleCertBadges({ vehicle }: { vehicle: VehicleDetail }) {
  const badges = [
    vehicle.inspection.available
      ? {
          mark: "AA",
          title: "AA Inspected",
          detail: vehicle.inspection.summary,
        }
      : null,
    {
      mark: "HPI",
      title: "HPI checked",
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
  ].filter(Boolean) as Array<{ mark: string; title: string; detail: string }>;

  return (
    <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Certificates">
      {badges.map((badge) => (
        <li
          key={badge.mark}
          className="flex min-w-[11rem] flex-1 shrink-0 items-center gap-3 rounded-[16px] bg-white p-2.5 pr-3 shadow-[0_6px_18px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#002852] text-[0.65rem] font-bold tracking-wide text-white">
            {badge.mark}
          </span>
          <span className="min-w-0">
            <span className="block text-caption font-semibold text-ink">
              {badge.title}
            </span>
            <span className="mt-0.5 block text-[0.7rem] leading-snug text-muted line-clamp-2">
              {badge.detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
