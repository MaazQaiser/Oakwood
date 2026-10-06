import { HomeFinanceStrip } from "@/components/home/HomeFinanceStrip";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import { HomeSearchCard } from "@/components/home/HomeSearchCard";

export function HomeHero() {
  return (
    <section className="relative -mt-[calc(var(--oak-header-height)-0.75rem)] mx-3 flex min-h-[calc(100dvh-3rem)] flex-col overflow-x-hidden rounded-[32px] bg-page-tint px-4 pb-8 pt-[calc(var(--oak-header-height)+1.25rem)] sm:mx-4 sm:px-6 lg:-mt-[calc(var(--oak-header-height)-1rem)] lg:mx-6 lg:min-h-[calc(100dvh-2rem)] lg:px-8 lg:pb-12">
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--oak-width-wide)] grow flex-col justify-center gap-5 lg:gap-7">
        <HomeProofStrip />
        <HomeSearchCard />
        <HomeFinanceStrip />
      </div>
    </section>
  );
}
