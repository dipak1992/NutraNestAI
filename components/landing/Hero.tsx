"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeroGeometric } from "@/components/ui/hero-geometric";
import { Button } from "./shared/Button";
import { socialProof } from "@/config/social-proof";
import { LandingTonightPreview } from "./LandingTonightPreview";
import { productStoryShort, trustCopy } from "@/lib/marketing/stats";

const trustItems = trustCopy;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <HeroGeometric
      badge="AI-Powered Meal Planning"
      title1={productStoryShort}
      title2="Household dinner handled."
    >
      {/* Description */}
      <p className="text-base sm:text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
        Plan dinner, fix the week, use leftovers, and keep groceries ready with
        Copilot. Start with a fridge scan, three quick preferences, or a direct
        ask.
      </p>

      {/* CTAs */}
      <motion.div
        custom={3}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
      >
        <Button
          href="/start"
          className="w-[88%] sm:w-auto text-center shadow-md shadow-[#D97757]/20 hover:shadow-lg hover:shadow-[#D97757]/28 active:shadow-sm active:scale-[0.98] transition-all duration-150"
        >
          Plan dinner free
        </Button>
        <Button
          href="/demo/scan"
          variant="secondary"
          className="w-[88%] sm:w-auto text-center !bg-white/[0.06] !border-white/[0.12] !text-white/80 hover:!bg-white/[0.10]"
        >
          Try fridge scan
        </Button>
        <a
          href="#how-it-works"
          className="text-white/40 hover:text-white/70 underline-offset-4 hover:underline text-sm font-medium transition-colors"
        >
          See how it works ↓
        </a>
      </motion.div>

      {/* Trust items */}
      <motion.div
        custom={4}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-medium text-white/30 mb-8"
      >
        {trustItems.map((item, i) => (
          <span key={item} className="inline-flex items-center gap-2">
            <span className="text-white/40">{item}</span>
            {i < trustItems.length - 1 && (
              <span
                className="inline-block h-1 w-1 rounded-full bg-white/20"
                aria-hidden
              />
            )}
          </span>
        ))}
      </motion.div>

      {/* Social proof + phone mockup row */}
      <motion.div
        custom={5}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-center justify-center gap-10 mt-4"
      >
        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 shrink-0" aria-hidden>
            {socialProof.testimonials.slice(0, 5).map((t, i) => (
              <div
                key={t.name}
                className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full ring-2 ring-[#030303] shadow-sm"
                style={{ transform: `translateY(${i % 2 === 0 ? 0 : 1}px)` }}
              >
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  sizes="36px"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
          <div className="min-w-0 text-left">
            <div className="text-xs sm:text-sm font-semibold text-white/80 leading-tight">
              <span className="text-amber-400">★★★★★</span>{" "}
              <span className="font-medium text-white/60">
                {socialProof.rating}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-white/40 leading-tight mt-0.5">
              Dinner decided in 3 seconds · Copilot included free
            </div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="relative shrink-0" style={{ width: "min(220px, calc(100vw - 80px))" }}>
          <div className="relative aspect-[9/19.5] rounded-[3rem] bg-neutral-900 p-3 shadow-2xl shadow-black/60 ring-1 ring-white/10">
            <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden bg-[#FBFAF3]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(217,119,87,0.14),transparent_32%)]" />
              <LandingTonightPreview />
            </div>
            {/* Notch */}
            <div
              aria-hidden
              className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-900 rounded-b-2xl"
            />
          </div>
          {/* Floating budget card */}
          <div className="absolute -right-12 bottom-1/4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 flex items-center gap-2 ring-1 ring-white/10">
            <div className="text-xl" aria-hidden>💰</div>
            <div>
              <div className="text-[10px] text-white/50">This week</div>
              <div className="text-xs font-semibold text-emerald-400">$87 — under budget</div>
            </div>
          </div>
        </div>
      </motion.div>
    </HeroGeometric>
  );
}
