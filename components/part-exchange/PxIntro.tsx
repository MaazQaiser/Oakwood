import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { IconCheck } from "@/components/ui/icons";
import { PxTowardsListing } from "@/components/part-exchange/PxTowardsListing";
import {
  PX_INTRO_CTA,
  PX_INTRO_HEADING,
  PX_INTRO_POINTS,
  PX_INTRO_SUPPORT,
  PX_MANUAL_FALLBACK,
  PX_MILEAGE_HELPER,
  PX_MOCK_NOTICE,
  PX_NO_IDENTITY_NOTICE,
} from "@/lib/part-exchange/copy";

const STEPS = [
  {
    title: "Value your car",
    body: "Enter the registration and mileage for the car you want to part-exchange.",
  },
  {
    title: "Confirm which car it is",
    body: "Pick the matching car from the catalogue so we value the right vehicle.",
  },
  {
    title: "Put it towards a listing",
    body: "Open an Oakwood car below and add the estimate to that deal.",
  },
] as const;

export function PxIntro({
  registration,
  mileage,
  registrationError,
  mileageError,
  starting,
  onRegistrationChange,
  onMileageChange,
  onSubmit,
  onManual,
  notice,
}: {
  registration: string;
  mileage: string;
  registrationError?: string;
  mileageError?: string;
  starting?: boolean;
  onRegistrationChange: (value: string) => void;
  onMileageChange: (value: string) => void;
  onSubmit: () => void;
  onManual: () => void;
  notice?: string;
}) {
  return (
    <>
      <PageBanner
        title={PX_INTRO_HEADING}
        description={PX_INTRO_SUPPORT}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-stretch">
          <form
            className="rounded-[14px] bg-white p-5 shadow-sm sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#002852]">
              Your current car
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Registration number"
                htmlFor="px-intro-registration"
                error={registrationError}
              >
                <Input
                  id="px-intro-registration"
                  name="registration"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={10}
                  value={registration}
                  error={Boolean(registrationError)}
                  onChange={(event) =>
                    onRegistrationChange(event.target.value.toUpperCase())
                  }
                  className="uppercase tracking-[0.12em]"
                  inputMode="text"
                />
              </Field>
              <Field
                label="Mileage"
                htmlFor="px-intro-mileage"
                hint={mileageError ? undefined : PX_MILEAGE_HELPER}
                error={mileageError}
              >
                <Input
                  id="px-intro-mileage"
                  name="mileage"
                  inputMode="numeric"
                  value={mileage}
                  error={Boolean(mileageError)}
                  onChange={(event) => onMileageChange(event.target.value)}
                />
              </Field>
              <Button type="submit" disabled={starting} busy={starting} className="w-full">
                {PX_INTRO_CTA}
              </Button>
              {notice ? (
                <p className="text-caption text-danger" role="alert">
                  {notice}
                </p>
              ) : null}
              <button
                type="button"
                className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline"
                onClick={onManual}
              >
                {PX_MANUAL_FALLBACK}
              </button>
            </div>
          </form>
          <aside
            aria-label="How part exchange works"
            className="flex flex-col justify-center rounded-[14px] bg-white/70 px-5 py-5 sm:px-6"
          >
            <ul className="flex flex-col gap-3">
              {PX_INTRO_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm text-ink">
                  <span className="mt-0.5 text-[#002852]">
                    <IconCheck />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-caption text-muted">{PX_NO_IDENTITY_NOTICE}</p>
            <p className="mt-2 text-caption text-muted">{PX_MOCK_NOTICE}</p>
          </aside>
        </div>
      </PageBanner>

      <Section>
        <Container>
          <h2 className="text-h2">How it works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[14px] bg-[#ECF3F8] px-5 py-5"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#002852]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-h5">{step.title}</h3>
                <p className="mt-2 text-body-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <PxTowardsListing />
    </>
  );
}
