"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, Chip, Divider } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { Drawer, Modal } from "@/components/ui/Dialogs";
import { EmptyState, ErrorState } from "@/components/ui/Feedback";
import { LoadingState, Skeleton } from "@/components/ui/Loading";
import { Tabs } from "@/components/ui/Tabs";
import { Toast, useToast } from "@/components/ui/Toast";
import { Tooltip } from "@/components/ui/Tooltip";
import { IconMenu } from "@/components/ui/icons";
import { Card, ContentCard, VehicleCard } from "@/components/cards/Card";
import {
  Checkbox,
  Field,
  Input,
  Radio,
  SearchInput,
  Select,
  Slider,
  Toggle,
} from "@/components/forms/FormControls";
import {
  APR,
  CashPrice,
  Deposit,
  FinanceSummary,
  FinanceTerm,
  MonthlyPayment,
  PersonalisedPricingIndicator,
} from "@/components/finance/FinancePrimitives";
import { CustomerFinanceControl } from "@/components/finance/CustomerFinanceControl";
import { Container, Grid, Inline, Section, Stack } from "@/components/layout/Container";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { mockVehicles } from "@/lib/mock/data";

const colours = [
  ["page", "var(--oak-page)"],
  ["page-tint", "var(--oak-page-tint)"],
  ["surface", "var(--oak-surface)"],
  ["ink", "var(--oak-ink)"],
  ["muted", "var(--oak-ink-muted)"],
  ["border", "var(--oak-border)"],
  ["primary", "var(--oak-primary)"],
  ["primary-hover", "var(--oak-primary-hover)"],
  ["primary-soft", "var(--oak-primary-soft)"],
  ["danger", "var(--oak-danger)"],
  ["warning", "var(--oak-warning)"],
  ["success", "var(--oak-success)"],
];

function ShowcaseHeading({
  id,
  children,
}: {
  id: string;
  children: string;
}) {
  return (
    <h2 id={id} className="text-h2">
      {children}
    </h2>
  );
}

export function DesignSystemShowcase() {
  const { pushToast } = useToast();
  const finance = useCustomerFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [slider, setSlider] = useState(1000);
  const vehicle = mockVehicles[0];
  const reservedVehicle = mockVehicles.find((item) => item.availability === "reserved");
  const soldVehicle = mockVehicles.find((item) => item.availability === "sold");

  return (
    <Container className="py-8 md:py-12">
      <header className="max-w-2xl">
        <p className="text-caption text-muted">Internal · not indexed</p>
        <h1 className="text-display mt-2">Design system</h1>
        <p className="text-body-lg mt-4 text-muted">
          Cinch discipline with Carvana tone. Cool neutrals, blue as the action
          colour, Regular 400 and SemiBold 600 only, monthly figure first.
        </p>
      </header>

      <nav aria-label="Design system sections" className="mt-8">
        <Inline gap="2">
          {[
            "typography",
            "colour",
            "buttons",
            "inputs",
            "cards",
            "finance",
            "alerts",
            "states",
            "overlays",
            "layout",
          ].map((item) => (
            <a key={item} href={`#${item}`} className="text-body-sm text-primary">
              {item}
            </a>
          ))}
        </Inline>
      </nav>

      <Section>
        <Stack gap="6">
          <ShowcaseHeading id="typography">Typography</ShowcaseHeading>
          <p className="text-display">Display</p>
          <h2 className="text-h1">Heading 1</h2>
          <h3 className="text-h2">Heading 2</h3>
          <h4 className="text-h3">Heading 3</h4>
          <p className="text-h4">Heading 4</p>
          <p className="text-h5">Heading 5</p>
          <p className="text-h6">Heading 6</p>
          <p className="text-body-lg">Body large for supporting intro copy.</p>
          <p className="text-body">Body for readable page content and forms.</p>
          <p className="text-body-sm">Body small for secondary detail.</p>
          <p className="text-caption">Caption</p>
          <p className="text-label">Label</p>
          <p className="text-button">Button text</p>
          <p className="text-primary">
            <span className="financial-number financial-number--lg">£249</span>
            <span className="text-body-sm text-muted">/mo</span>
          </p>
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="colour">Colour</ShowcaseHeading>
          <Grid columns="cards">
            {colours.map(([name, value]) => (
              <div key={name} className="overflow-hidden rounded-lg border border-border">
                <div className="h-16" style={{ background: value }} />
                <p className="px-3 py-2 text-caption">{name}</p>
              </div>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="buttons">Buttons</ShowcaseHeading>
          <Inline>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="text">Text button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
            <Button busy>Saving</Button>
            <IconButton label="Menu">
              <IconMenu />
            </IconButton>
          </Inline>
        </Stack>
      </Section>

      <Section>
        <Stack gap="6">
          <ShowcaseHeading id="inputs">Inputs</ShowcaseHeading>
          <Grid columns="two">
            <Field htmlFor="demo-input" label="Name">
              <Input id="demo-input" name="name" />
            </Field>
            <Field htmlFor="demo-select" label="Make">
              <Select id="demo-select" name="make" defaultValue="audi">
                <option value="audi">Audi</option>
                <option value="ford">Ford</option>
              </Select>
            </Field>
            <Field htmlFor="demo-search" label="Search">
              <SearchInput id="demo-search" name="q" placeholder="Search" />
            </Field>
            <Field htmlFor="demo-error" label="Email" error="Enter a valid email">
              <Input id="demo-error" name="email" error />
            </Field>
          </Grid>
          <Checkbox name="terms" label="Keep me updated about this enquiry" />
          <Radio name="finance-type" value="hp" label="Hire purchase" defaultChecked />
          <Radio name="finance-type" value="pcp" label="PCP" />
          <Toggle name="personalised" label="Show personalised prices" />
          <Slider
            name="deposit-demo"
            label="Deposit"
            min={0}
            max={5000}
            step={250}
            value={slider}
            onChange={(event) => setSlider(Number(event.target.value))}
          />
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="cards">Cards</ShowcaseHeading>
          <Grid>
            <Card>Generic card surface.</Card>
            <ContentCard title="Content card">Short supporting text.</ContentCard>
            <VehicleCard vehicle={vehicle} monthly={249} />
            {reservedVehicle ? <VehicleCard vehicle={reservedVehicle} /> : null}
            {soldVehicle ? <VehicleCard vehicle={soldVehicle} /> : null}
          </Grid>
        </Stack>
      </Section>

      <Section>
        <Stack gap="6">
          <ShowcaseHeading id="finance">Finance</ShowcaseHeading>
          <Inline>
            <CustomerFinanceControl />
            <Button
              variant="secondary"
              onClick={() =>
                finance.setMode(
                  finance.mode === "anonymous"
                    ? "personalised"
                    : finance.mode === "personalised"
                      ? "ineligible"
                      : "anonymous",
                )
              }
            >
              Toggle session state
            </Button>
          </Inline>
          <PersonalisedPricingIndicator
            state={
              finance.mode === "anonymous" ? "anonymous" : finance.mode
            }
          />
          <Grid>
            <FinanceSummary
              monthly={249}
              cash={18995}
              apr={11.9}
              deposit={1000}
              term={48}
              state="representative"
            />
            <FinanceSummary
              monthly={219}
              cash={18995}
              apr={9.9}
              deposit={finance.deposit}
              term={finance.term}
              state="personalised"
            />
            <FinanceSummary
              monthly={329}
              cash={27995}
              apr={9.9}
              deposit={1000}
              term={48}
              state="ineligible"
              gapAmount={2500}
            />
            <FinanceSummary state="missing" cash={18995} />
            <FinanceSummary state="loading" />
          </Grid>
          <Inline>
            <Badge>Representative</Badge>
            <Badge tone="finance">Personalised</Badge>
            <Badge tone="warning">Needs more deposit</Badge>
          </Inline>
          <div className="flex flex-col gap-3">
            <MonthlyPayment amount={249} state="personalised" />
            <CashPrice amount={18995} />
            <APR value={9.9} state="personalised" />
            <Deposit amount={1000} />
            <FinanceTerm months={48} />
          </div>
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="alerts">Alerts and status</ShowcaseHeading>
          <Alert title="Information">Representative pricing is shown until eligibility is complete.</Alert>
          <Alert title="Saved" tone="success">Deal saved.</Alert>
          <Alert title="Needs attention" tone="warning">This vehicle needs more deposit.</Alert>
          <Alert title="Could not send" tone="danger">Try again.</Alert>
          <Inline>
            <Badge>Neutral</Badge>
            <Badge tone="finance">Personalised</Badge>
            <Chip>Automatic</Chip>
            <LoadingState label="Recalculating" />
            <Skeleton className="h-6 w-24" />
          </Inline>
          <Toast title="Example toast" />
          <Button variant="secondary" onClick={() => pushToast("Toast sent", "success")}>
            Show toast
          </Button>
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="states">Shared states</ShowcaseHeading>
          <EmptyState
            title="No cars match your current filters."
            actions={
              <>
                <Button>Clear filters</Button>
                <Button variant="secondary">View all cars</Button>
              </>
            }
          >
            Try removing a filter, or browse the full range.
          </EmptyState>
          <ErrorState
            title="We couldn't complete that request."
            actions={<Button size="sm">Try again</Button>}
          >
            You can try again or speak to Oakwood.
          </ErrorState>
          <LoadingState label="Loading your result" />
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="overlays">Overlays and disclosure</ShowcaseHeading>
          <Inline>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
            <Tooltip label="Visible on focus and hover">
              <Button variant="text">Tooltip target</Button>
            </Tooltip>
          </Inline>
          <Accordion title="What is included?">Plain supporting detail.</Accordion>
          <Tabs
            label="Example tabs"
            items={[
              { id: "one", label: "Overview", content: <p className="text-body-sm">Overview panel</p> },
              { id: "two", label: "Detail", content: <p className="text-body-sm">Detail panel</p> },
            ]}
          />
          <Modal open={modalOpen} title="Example modal" onClose={() => setModalOpen(false)}>
            <p className="text-body-sm text-muted">Accessible dialog foundation.</p>
          </Modal>
          <Drawer open={drawerOpen} title="Example drawer" onClose={() => setDrawerOpen(false)}>
            <p className="text-body-sm text-muted">Mobile menu uses this drawer.</p>
          </Drawer>
        </Stack>
      </Section>

      <Section>
        <Stack gap="4">
          <ShowcaseHeading id="layout">Layout and breakpoints</ShowcaseHeading>
          <p className="text-body-sm text-muted">
            Mobile-first from 390px. Adaptations at 768, 1024, 1280 and 1440.
            Header, navigation and footer are live in the global shell.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["390", "768", "1024", "1280", "1440"].map((width) => (
              <div
                key={width}
                className="rounded-md border border-dashed border-border-strong px-3 py-6 text-center text-caption"
              >
                {width}px
              </div>
            ))}
          </div>
          <Divider />
        </Stack>
      </Section>
    </Container>
  );
}
