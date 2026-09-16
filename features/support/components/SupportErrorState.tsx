import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { CONTACT_CALL, CONTACT_TRY_AGAIN } from "@/lib/support/copy";
import { toTelHref } from "@/lib/format/phone";

export function SupportErrorState({
  title,
  onRetry,
  telephone,
}: {
  title: string;
  onRetry: () => void;
  telephone?: string;
}) {
  return (
    <Alert title={title} tone="danger">
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={onRetry}>
          {CONTACT_TRY_AGAIN}
        </Button>
        {telephone ? (
          <Button href={toTelHref(telephone)} variant="secondary">
            {CONTACT_CALL}
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
