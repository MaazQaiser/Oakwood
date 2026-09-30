"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import { EligibilityLayout } from "@/components/eligibility/EligibilityLayout";
import { ensureEligibilitySession, getEligibilityUiState } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { MOCK_SCHEMA_NOTICE } from "@/lib/eligibility/copy";
import { routes } from "@/config/routes";
import { useEligibilityJourney } from "@/components/eligibility/EligibilityJourneyProvider";

const TRUST_POINTS = [
  "Soft search",
  "No impact on your credit score",
  "No account required",
  "Results shown immediately",
];

export function EligibilityIntro() {
  const router = useRouter();
  const journey = useEligibilityJourney();
  const [starting, setStarting] = useState(false);

  async function start() {
    setStarting(true);
    trackEvent(analyticsEvents.eligibilityStarted);
    const state = await getEligibilityUiState();
    if (state.status === "complete") {
      journey.applyUiState(state);
      router.push(routes.eligibilityResult);
      return;
    }
    journey.setMachine("QUESTION");
    await ensureEligibilitySession();
    router.push(routes.eligibilityQuestions);
  }

  return (
    <>
      <PageBanner
        title="Find out what you could afford."
        description="Check your finance eligibility in around 60 seconds. It won't affect your credit score."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => void start()} busy={starting} className="w-full sm:w-auto">
              Start eligibility check
            </Button>
            <Button href={routes.howItWorks} variant="secondary" className="w-full sm:w-auto">
              How it works
            </Button>
          </div>
        }
      />
      <EligibilityLayout>
      <ul className="mt-6 flex flex-col gap-3">
        {TRUST_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3 text-body-sm">
            <span className="mt-0.5 text-success">
              <IconCheck />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <aside className="mt-8 rounded-[14px] bg-[#ECF3F8] px-5 py-4">
        <p className="text-sm font-semibold text-ink">Please note</p>
        <ul className="mt-3 flex flex-col gap-2 text-body-sm text-ink">
          <li>You can save and come back later.</li>
          <li>{MOCK_SCHEMA_NOTICE}</li>
        </ul>
      </aside>

      <section id="how-it-works" className="mt-12 scroll-mt-24">
        <h2 className="text-h3">What happens next?</h2>
        <ol className="mt-4 flex flex-col gap-3 text-body-sm">
          <li>1. Tell us a little about yourself</li>
          <li>2. We perform a soft credit search</li>
          <li>3. See your indicative finance result</li>
          <li>4. Browse cars based on your budget</li>
        </ol>
        <div className="mt-8 border-t border-[#d0d5dd] pt-5">
          <p className="text-body-sm text-muted">
            Required legal information is shown before we run the check.
          </p>
          <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <li>
              <a
                className="text-body-sm font-semibold text-[#002852] underline-offset-4 hover:underline"
                href={routes.privacyPolicy}
              >
                Privacy policy
              </a>
            </li>
            <li>
              <a
                className="text-body-sm font-semibold text-[#002852] underline-offset-4 hover:underline"
                href={routes.statusDisclosure}
              >
                Status disclosure
              </a>
            </li>
          </ul>
        </div>
      </section>
    </EligibilityLayout>
    </>
  );
}
