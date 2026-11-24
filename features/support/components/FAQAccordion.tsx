"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { Container, Section } from "@/components/layout/Container";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { supportFaqCategories } from "@/lib/support/content";
import {
  FAQ_CONTACT,
  FAQ_EMPTY,
  FAQ_SEARCH_LABEL,
} from "@/lib/support/copy";
import { routes } from "@/config/routes";
import type { SupportFaqCategory, SupportFaqItem } from "@/types/support";

export function FAQAccordion({
  items,
  heading = "Questions",
  hideEmptyCategories = false,
}: {
  items: SupportFaqItem[];
  heading?: string;
  /** When true, only show category chips that exist in `items`. Hide the row if one or fewer. */
  hideEmptyCategories?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SupportFaqCategory | "all">("all");

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        return;
      }
      const node = document.getElementById(hash);
      if (node instanceof HTMLDetailsElement) {
        node.open = true;
        node.scrollIntoView({ block: "start" });
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const availableCategories = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    const filtered = supportFaqCategories.filter((item) => present.has(item.value));
    return hideEmptyCategories ? filtered : supportFaqCategories;
  }, [hideEmptyCategories, items]);

  const showCategoryRow =
    !hideEmptyCategories || availableCategories.length > 1;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "all" || item.category === category;
      if (!inCategory) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        item.question.toLowerCase().includes(needle) ||
        item.answer.toLowerCase().includes(needle)
      );
    });
  }, [category, items, query]);

  return (
    <Section>
      <Container width="narrow">
        <h2 id="faq-heading" className="text-h2">
          {heading}
        </h2>
        <div className="mt-6">
          <Field htmlFor="faq-search" label={FAQ_SEARCH_LABEL}>
            <Input
              id="faq-search"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </Field>
        </div>
        {showCategoryRow ? (
          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="FAQ categories"
          >
            <Button
              type="button"
              size="sm"
              className="shrink-0"
              variant={category === "all" ? "primary" : "secondary"}
              onClick={() => {
                setCategory("all");
                trackEvent(analyticsEvents.faqCategorySelected, {
                  category: "all",
                });
              }}
            >
              All
            </Button>
            {availableCategories.map((item) => (
              <Button
                key={item.value}
                type="button"
                size="sm"
                className="shrink-0"
                variant={category === item.value ? "primary" : "secondary"}
                onClick={() => {
                  setCategory(item.value);
                  trackEvent(analyticsEvents.faqCategorySelected, {
                    category: item.value,
                  });
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : null}
        {visible.length === 0 ? (
          <div className="mt-8">
            <p className="text-body text-muted">{FAQ_EMPTY}</p>
            <p className="mt-4">
              <Button href={routes.contact}>{FAQ_CONTACT}</Button>
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {visible.map((item) => (
              <Accordion
                key={item.id}
                id={item.id}
                title={item.question}
                onOpen={() =>
                  trackEvent(analyticsEvents.faqQuestionOpened, {
                    id: item.id,
                    category: item.category,
                  })
                }
              >
                <p>{item.answer}</p>
                {item.href ? (
                  <p>
                    <Link
                      href={item.href}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {item.hrefLabel ?? "Learn more"}
                    </Link>
                  </p>
                ) : null}
              </Accordion>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
