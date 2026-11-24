import {
  ifBody,
  ifSectionTitle,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import type { InterestFreePackage } from "@/lib/finance/interest-free/package";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function PackageSection({ pkg }: { pkg: InterestFreePackage }) {
  return (
    <section aria-labelledby="if-package-heading">
      <h2 id="if-package-heading" className={ifSectionTitle}>
        {INTEREST_FREE_COPY.packageTitle}
      </h2>
      <p className={cn("mt-3", ifBody)}>{INTEREST_FREE_COPY.packageLede}</p>

      <dl className="mt-5 divide-y divide-[#E7EEF4] rounded-[16px] border border-[#E7EEF4] bg-white px-4">
        <PkgRow
          title="AA warranty, 3 years"
          note="Backed by the AA, with AA breakdown included"
          value={pkg.warranty}
        />
        <PkgRow
          title="Service plan, 3 years"
          note="Manufacturer schedule, at our own workshops"
          value={pkg.service}
        />
        <PkgRow
          title="MOT plan, 3 years"
          note="Test fee covered, with a reminder three weeks before"
          value={pkg.mot}
        />
        <PkgRow
          title="Supagard"
          note="Paint and interior protection, applied before you collect"
          value={pkg.supagard}
        />
        <div className="flex items-end justify-between py-3.5">
          <dt className="text-base font-semibold text-[#002852]">Total on this car</dt>
          <dd className="text-[1.5rem] font-semibold tabular-nums text-[#002852]">
            {formatPounds(pkg.total)}
          </dd>
        </div>
      </dl>

      <div className={cn(ifSoftPanel, "mt-5 p-4")}>
        <p className="text-base font-semibold text-[#002852]">
          {INTEREST_FREE_COPY.packageTransferTitle}
        </p>
        <p className={cn("mt-1", ifBody)}>{INTEREST_FREE_COPY.packageTransferBody}</p>
      </div>
    </section>
  );
}

function PkgRow({
  title,
  note,
  value,
}: {
  title: string;
  note: string;
  value: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <dt>
        <span className="block text-sm font-semibold text-[#002852]">{title}</span>
        <span className="text-xs text-muted">{note}</span>
      </dt>
      <dd className="shrink-0 font-semibold tabular-nums text-[#002852]">
        {formatPounds(value)}
      </dd>
    </div>
  );
}
