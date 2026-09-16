import Link from "next/link";
import { Container, Grid, Section } from "@/components/layout/Container";
import { Card } from "@/components/cards/Card";
import { getEligibilityUrl, getFinanceIntentUrl, routes } from "@/config/routes";
import {
  CALCULATOR_APPLICATION_EXPLAIN,
  CALCULATOR_APPLICATION_LABEL,
  CALCULATOR_EDUCATION_HEADING,
  CALCULATOR_EDUCATION_HP,
  CALCULATOR_EDUCATION_PCP,
  CALCULATOR_ELIGIBILITY_EXPLAIN,
  CALCULATOR_ELIGIBILITY_LABEL,
  CALCULATOR_ESTIMATE_EXPLAIN,
  CALCULATOR_ESTIMATE_LABEL,
} from "@/lib/finance/calculator-copy";

export function CalculatorEducation() {
  return (
    <Section>
      <Container>
        <h2 className="text-h2">{CALCULATOR_EDUCATION_HEADING}</h2>
        <Grid columns="two" className="mt-6">
          <Card as="article">
            <h3 className="text-h4">{CALCULATOR_ESTIMATE_LABEL}</h3>
            <p className="mt-2 text-body-sm text-muted">
              {CALCULATOR_ESTIMATE_EXPLAIN}
            </p>
          </Card>
          <Card as="article">
            <h3 className="text-h4">{CALCULATOR_ELIGIBILITY_LABEL}</h3>
            <p className="mt-2 text-body-sm text-muted">
              {CALCULATOR_ELIGIBILITY_EXPLAIN}{" "}
              <Link href={getEligibilityUrl()} className="text-primary">
                Check my eligibility
              </Link>
            </p>
          </Card>
          <Card as="article">
            <h3 className="text-h4">{CALCULATOR_APPLICATION_LABEL}</h3>
            <p className="mt-2 text-body-sm text-muted">
              {CALCULATOR_APPLICATION_EXPLAIN}
            </p>
          </Card>
          <Card as="article">
            <h3 className="text-h4">HP and PCP</h3>
            <p className="mt-2 text-body-sm text-muted">{CALCULATOR_EDUCATION_HP}</p>
            <p className="mt-2 text-body-sm text-muted">{CALCULATOR_EDUCATION_PCP}</p>
            <p className="mt-3 text-body-sm">
              <Link href={getFinanceIntentUrl("hp")} className="text-primary">
                Hire Purchase
              </Link>
              {" · "}
              <Link href={getFinanceIntentUrl("pcp")} className="text-primary">
                Personal Contract Purchase
              </Link>
            </p>
          </Card>
        </Grid>
        <p className="mt-6 text-body-sm">
          <Link href={routes.finance} className="text-primary">
            Back to finance
          </Link>
        </p>
      </Container>
    </Section>
  );
}
