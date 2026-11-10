"use client";

import { useEffect, useMemo, useState } from "react";
import { IconArrow, IconClose, IconSearch } from "@/components/ui/icons";
import { HelpArrowLink } from "@/features/support/help/HelpArrowLink";
import { HelpTopicIcon } from "@/features/support/help/HelpIcons";
import { cn } from "@/lib/cn";
import {
  countFaqsForTopic,
  filterHelpFaqs,
  HELP_FAQS,
  HELP_POPULAR_IDS,
  HELP_TOPICS,
  type HelpFaq,
  type HelpTopicId,
} from "@/lib/support/help-hub";

const POPULAR_LABELS: Record<(typeof HELP_POPULAR_IDS)[number], { tag: string; title: string }> = {
  "elig-credit": { tag: "Finance", title: "Will checking eligibility affect my credit score?" },
  "res-99": { tag: "Reservations", title: "How does the £99 reservation work?" },
  "mot-book": { tag: "Servicing and MOT", title: "How do I book an MOT?" },
};

const MOBILE_WIDTH = "max-[480px]:max-w-[350px]";

function isTopicId(value: string): value is HelpTopicId {
  return HELP_TOPICS.some((topic) => topic.id === value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  return text.split(new RegExp(`(${escapeRegExp(q)})`, "ig")).map((part, index) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded-[4px] bg-[#FFE89A] px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function scrollToQuestion(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(`help-q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

export function HelpFaqClient() {
  const [topicId, setTopicId] = useState<HelpTopicId>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      if (isTopicId(hash)) {
        setTopicId(hash);
        setQuery("");
        return;
      }
      const faq = HELP_FAQS.find((item) => item.id === hash);
      if (faq) {
        setTopicId(faq.topicId);
        setQuery("");
        setOpenId(faq.id);
        scrollToQuestion(faq.id);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const searching = Boolean(query.trim());
  const faqs = useMemo(
    () => filterHelpFaqs(searching ? "all" : topicId, query),
    [topicId, query, searching],
  );
  const activeTopic = HELP_TOPICS.find((topic) => topic.id === topicId) ?? HELP_TOPICS[0];

  const groups = useMemo(() => {
    const map = new Map<string, HelpFaq[]>();
    for (const faq of faqs) {
      const key = searching || topicId === "all"
        ? HELP_TOPICS.find((topic) => topic.id === faq.topicId)?.name ?? ""
        : faq.group ?? "";
      map.set(key, [...(map.get(key) ?? []), faq]);
    }
    return [...map.entries()];
  }, [faqs, searching, topicId]);

  function selectTopic(next: HelpTopicId) {
    setTopicId(next);
    setQuery("");
    setOpenId(null);
    window.history.replaceState(null, "", next === "all" ? "/help" : `/help#${next}`);
    document.getElementById("help-answers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openQuestion(id: string) {
    const faq = HELP_FAQS.find((item) => item.id === id);
    if (!faq) return;
    setTopicId(faq.topicId);
    setQuery("");
    setOpenId(faq.id);
    window.history.replaceState(null, "", `/help#${faq.id}`);
    scrollToQuestion(faq.id);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] overflow-hidden bg-[#002852] px-6 pt-[calc(var(--oak-header-height)+2.25rem)] pb-12 text-white lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-[var(--oak-page-x)] lg:rounded-[32px] lg:px-0 lg:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(0,156,224,0.45)_0%,rgba(0,156,224,0)_60%),radial-gradient(60%_60%_at_0%_100%,rgba(0,97,162,0.55)_0%,rgba(0,97,162,0)_70%),linear-gradient(135deg,#001c3d_0%,#002852_45%,#0061a2_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 hidden h-[28rem] w-[28rem] rounded-full border border-white/10 lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 hidden h-[18rem] w-[18rem] rounded-full border border-white/10 lg:block"
        />

        <div
          className={cn(
            "relative z-10 mx-auto grid w-full max-w-[var(--oak-width-wide)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:px-[var(--oak-page-x)]",
            MOBILE_WIDTH,
          )}
        >
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.75rem] font-semibold tracking-[0.08em] text-[#9fd3f2] uppercase ring-1 ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              Help and support
            </p>
            <h1 className="mt-5 max-w-xl text-[2.3rem] font-semibold leading-[1.1em] tracking-[-0.03em] text-white sm:text-[3rem] lg:text-[3.4rem]">
              How can we help you today?
            </h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/75">
              Answers about buying, finance, reservations and looking after your car,
              all in one place.
            </p>

            <form
              role="search"
              className="mt-8 max-w-xl"
              onSubmit={(event) => {
                event.preventDefault();
                document.getElementById("help-answers")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="flex items-center gap-2 rounded-[20px] bg-white p-2 shadow-[0_18px_40px_rgba(0,16,40,0.28)]">
                <label htmlFor="help-search" className="sr-only">
                  Search help
                </label>
                <span className="pl-3 text-[#667085]">
                  <IconSearch />
                </span>
                <input
                  id="help-search"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpenId(null);
                  }}
                  placeholder="Search deposit, MOT, refund…"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-3 text-base text-[#1d2433] outline-none placeholder:text-[#8b95a3] [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-[#667085] hover:bg-[#F2F7FB]"
                  >
                    <IconClose width={18} height={18} />
                  </button>
                ) : null}
                <button
                  type="submit"
                  aria-label="Search"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[#002852] text-white hover:bg-[#001c3d]"
                >
                  <IconSearch />
                </button>
              </div>
            </form>
            <p className="mt-4 text-caption text-white/60">
              {HELP_FAQS.length} answers across {HELP_TOPICS.length - 1} topics
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-white/60 uppercase">
              Popular questions
            </p>
            <ol className="mt-3 space-y-3">
              {HELP_POPULAR_IDS.map((id, index) => {
                const label = POPULAR_LABELS[id];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openQuestion(id)}
                      className="group flex w-full items-center gap-4 rounded-[20px] bg-white/[0.08] p-4 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/[0.14]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-white text-[1rem] font-semibold text-[#002852] tabular-nums">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.7rem] font-semibold tracking-[0.06em] text-[#9fd3f2] uppercase">
                          {label.tag}
                        </span>
                        <span className="mt-0.5 block text-[0.95rem] font-semibold leading-snug text-white">
                          {label.title}
                        </span>
                      </span>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white/10 text-white transition group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-[#002852]">
                        <IconArrow width={16} height={16} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Browse by topic */}
      <nav
        aria-label="Help topics"
        className="relative z-20 px-6 pt-10 md:sticky md:top-[calc(var(--oak-header-height)+0.5rem)] md:pt-6 lg:px-0"
      >
        <div className={cn("mx-auto w-full max-w-[var(--oak-width-wide)] lg:px-[var(--oak-page-x)]", MOBILE_WIDTH)}>
          <div className="rounded-[24px] bg-white p-3 shadow-[0_10px_30px_rgba(16,40,72,0.08)] ring-1 ring-[#E7EEF4] md:p-2">
            <p className="px-2 pt-1 pb-2 text-[0.75rem] font-semibold tracking-[0.08em] text-muted uppercase md:sr-only">
              Browse by topic
            </p>
            <ul className="flex flex-wrap gap-2 md:flex-nowrap md:overflow-x-auto md:[scrollbar-width:none] xl:flex-wrap xl:overflow-visible">
              {HELP_TOPICS.map((topic) => {
                const pressed = !searching && topicId === topic.id;
                return (
                  <li key={topic.id} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => selectTopic(topic.id)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-[14px] px-3 text-sm font-semibold whitespace-nowrap transition",
                        pressed
                          ? "bg-[#002852] text-white"
                          : "bg-[#F2F7FB] text-[#1d2433] hover:bg-[#E7F1F8]",
                      )}
                    >
                      <HelpTopicIcon
                        topic={topic.id}
                        className={pressed ? "text-[#9fd3f2]" : "text-primary"}
                      />
                      {topic.name}
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[0.7rem] tabular-nums",
                          pressed ? "bg-white/15 text-white" : "bg-white text-muted",
                        )}
                      >
                        {countFaqsForTopic(topic.id)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Answers */}
      <section
        id="help-answers"
        aria-labelledby="help-answers-heading"
        className="scroll-mt-[calc(var(--oak-header-height)+6rem)] px-6 py-10 md:py-14 lg:px-0"
      >
        <div
          className={cn(
            "mx-auto grid w-full max-w-[var(--oak-width-wide)] gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12 lg:px-[var(--oak-page-x)]",
            MOBILE_WIDTH,
          )}
        >
          <aside className="min-w-0">
            <div className="rounded-[28px] bg-[#ECF3F8] p-6 lg:sticky lg:top-[calc(var(--oak-header-height)+6.5rem)]">
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#002852] text-white">
                {searching ? <IconSearch /> : <HelpTopicIcon topic={activeTopic.id} width={20} height={20} />}
              </span>
              <h2
                id="help-answers-heading"
                className="mt-5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[#002852]"
              >
                {searching ? "Search results" : activeTopic.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {searching
                  ? `${faqs.length} answer${faqs.length === 1 ? "" : "s"} matching “${query.trim()}”.`
                  : activeTopic.blurb}
              </p>
              {!searching ? (
                <p className="mt-4 text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[#002852] tabular-nums">
                  {countFaqsForTopic(activeTopic.id)}
                  <span className="ml-1.5 text-sm font-medium tracking-normal text-secondary">
                    questions
                  </span>
                </p>
              ) : null}
              {!searching && activeTopic.serviceLink ? (
                <HelpArrowLink href={activeTopic.serviceLink.href} className="mt-6 w-full">
                  {activeTopic.serviceLink.label}
                </HelpArrowLink>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0">
            {faqs.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#C9D6E2] bg-white p-8 text-center">
                <p className="text-lg font-semibold text-[#002852]">No answers match that yet</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-secondary">
                  Try a shorter word, browse a topic, or speak to the team directly.
                </p>
                <HelpArrowLink href="#contact" className="mt-6">
                  Contact Oakwood
                </HelpArrowLink>
              </div>
            ) : (
              <div className="space-y-8">
                {groups.map(([group, items]) => (
                  <div key={group || "ungrouped"}>
                    {group ? (
                      <p className="mb-3 flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.08em] text-muted uppercase">
                        {group}
                        <span className="h-px flex-1 bg-[#E7EEF4]" />
                      </p>
                    ) : null}
                    <div className="space-y-2.5">
                      {items.map((faq) => (
                        <HelpQuestion
                          key={faq.id}
                          faq={faq}
                          query={query}
                          open={openId === faq.id}
                          onToggle={(next) => setOpenId(next ? faq.id : null)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function HelpQuestion({
  faq,
  query,
  open,
  onToggle,
}: {
  faq: HelpFaq;
  query: string;
  open: boolean;
  onToggle: (open: boolean) => void;
}) {
  return (
    <details
      id={`help-q-${faq.id}`}
      open={open}
      onToggle={(event) => {
        const next = (event.target as HTMLDetailsElement).open;
        if (next !== open) onToggle(next);
      }}
      className={cn(
        "group scroll-mt-[calc(var(--oak-header-height)+7rem)] rounded-[20px] bg-white ring-1 transition",
        open
          ? "shadow-[0_14px_32px_rgba(16,40,72,0.10)] ring-[#0061a2]/25"
          : "shadow-[0_6px_18px_rgba(16,40,72,0.05)] ring-[#E7EEF4] hover:ring-[#C9D6E2]",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <span className="text-[0.975rem] font-semibold leading-snug text-[#1d2433]">
          {highlight(faq.question, query)}
        </span>
        <span
          aria-hidden
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-lg leading-none transition",
            open ? "rotate-45 bg-[#002852] text-white" : "bg-[#F2F7FB] text-[#002852]",
          )}
        >
          +
        </span>
      </summary>
      <div className="px-5 pb-5">
        <p className="border-t border-[#E7EEF4] pt-4 text-sm leading-relaxed text-secondary">
          {highlight(faq.answer, query)}
        </p>
        {faq.link?.verified ? (
          <a
            href={faq.link.href}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline hover:underline"
          >
            {faq.link.label}
            <IconArrow width={14} height={14} />
          </a>
        ) : null}
      </div>
    </details>
  );
}
