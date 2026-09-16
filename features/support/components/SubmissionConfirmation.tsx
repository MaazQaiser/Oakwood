import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function SubmissionConfirmation({
  title,
  reference,
  nextStep,
  href,
  hrefLabel,
}: {
  title: string;
  reference: string;
  nextStep: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <Alert title={title} tone="success">
      <p>Reference {reference}.</p>
      <p className="mt-2">{nextStep}</p>
      <p className="mt-4">
        <Button href={href} variant="secondary" size="sm">
          {hrefLabel}
        </Button>
      </p>
    </Alert>
  );
}
