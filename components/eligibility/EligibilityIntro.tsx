"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityMockNotice,
  EligibilityTrustMessage,
} from "@/components/eligibility/EligibilityLayout";
import { ensureEligibilitySession, getEligibilityUiState } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
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
    <EligibilityLayout>
      <EligibilityHeader />
      <h1 className="mt-3 text-h1">Find out what you could afford.</h1>
      <p className="mt-3 text-body text-muted">
        Check your finance eligibility in around 60 seconds. It won&apos;t
        affect your credit score.
      </p>

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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => void start()} busy={starting} className="w-full sm:w-auto">
          Start eligibility check
        </Button>
        <Button href="#how-it-works" variant="secondary" className="w-full sm:w-auto">
          How it works
        </Button>
      </div>

      <p className="mt-4 text-caption text-muted">
        You can save and come back later.
      </p>
      <EligibilityTrustMessage className="mt-2" />
      <EligibilityMockNotice />

      <section id="how-it-works" className="mt-12 scroll-mt-24">
        <h2 className="text-h3">What happens next?</h2>
        <ol className="mt-4 flex flex-col gap-3 text-body-sm">
          <li>1. Tell us a little about yourself</li>
          <li>2. We perform a soft credit search</li>
          <li>3. See your indicative finance result</li>
          <li>4. Browse cars based on your budget</li>
        </ol>
        <p className="mt-4 text-caption text-muted">
          Required legal information is shown before we run the check.{" "}
          <a className="text-primary underline-offset-4 hover:underline" href={routes.privacyPolicy}>
            Privacy policy
          </a>
          {" · "}
          <a className="text-primary underline-offset-4 hover:underline" href={routes.statusDisclosure}>
            Status disclosure
          </a>
        </p>
      </section>
    </EligibilityLayout>
  );
}
