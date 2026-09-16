import { Button } from "@/components/ui/Button";
import type { ProcessStep as ProcessStepData } from "@/types/trust";

export function ProcessStep({ step }: { step: ProcessStepData }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4 md:p-5">
      <p className="financial-number financial-number--sm text-primary">
        {step.number}
      </p>
      <h2 className="mt-3 text-h4">{step.title}</h2>
      <p className="mt-2 text-body-sm text-muted">{step.copy}</p>
      {step.href && step.cta ? (
        <p className="mt-4">
          <Button href={step.href} variant="secondary">
            {step.cta}
          </Button>
        </p>
      ) : null}
    </article>
  );
}
