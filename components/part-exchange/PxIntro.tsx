import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import {
  EligibilityLayout,
} from "@/components/eligibility/EligibilityLayout";
import {
  PX_EYEBROW,
  PX_INTRO_CTA,
  PX_INTRO_HEADING,
  PX_INTRO_POINTS,
  PX_INTRO_SUPPORT,
  PX_MOCK_NOTICE,
  PX_NO_IDENTITY_NOTICE,
} from "@/lib/part-exchange/copy";

export function PxIntro({
  onStart,
  starting,
}: {
  onStart: () => void;
  starting?: boolean;
}) {
  return (
    <>
      <PageBanner
        eyebrow={PX_EYEBROW}
        title={PX_INTRO_HEADING}
        description={PX_INTRO_SUPPORT}
        actions={
          <Button onClick={onStart} disabled={starting} className="w-full sm:w-auto">
            {PX_INTRO_CTA}
          </Button>
        }
      />
      <EligibilityLayout>
      <ul className="mt-6 flex flex-col gap-3">
        {PX_INTRO_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3 text-body-sm">
            <span className="mt-0.5 text-success">
              <IconCheck />
            </span>
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-caption text-muted">{PX_NO_IDENTITY_NOTICE}</p>
      <p className="mt-2 text-caption text-muted">{PX_MOCK_NOTICE}</p>
    </EligibilityLayout>
    </>
  );
}
