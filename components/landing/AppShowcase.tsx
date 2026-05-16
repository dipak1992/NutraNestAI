"use client";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll";

export function AppShowcase() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF6F1]/60 to-white dark:from-neutral-950 dark:via-neutral-900/60 dark:to-neutral-950"
      style={{ position: "relative" }}
      aria-label="App preview"
    >
      <ContainerScroll
        titleComponent={
          <div className="mb-6 md:mb-10">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#D97757]/10 text-[#D97757] dark:bg-[#D97757]/20">
              See it in action
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1]">
              Your whole week,{" "}
              <span className="italic text-[#D97757]">planned in seconds.</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Scan your fridge, tell Copilot what you need, and get a full
              dinner plan with a grocery list — ready before you leave the
              kitchen.
            </p>
          </div>
        }
      >
        {/* App screenshot — replace src with your actual dashboard screenshot */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src="/landing/optimized/hero-section.webp"
            alt="NutriNest app dashboard showing weekly meal plan and grocery list"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={false}
          />
          {/* Subtle inner vignette to blend edges */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </div>
      </ContainerScroll>
    </section>
  );
}
