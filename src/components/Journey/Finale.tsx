"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { friends } from "@/lib/friends";
import { playSfx } from "@/lib/audio";
import ColorGrade from "@/components/fx/ColorGrade";
import Vignette from "@/components/fx/Vignette";
import { RingBack, posterStage, letterRise, letterGroup, rise, ghostRise } from "./poster";

const NAME = "PRIYANKA";

// Fixed star positions (no Math.random at render → no hydration mismatch).
// Only visible if the fireworks footage fails to load (it's the fallback).
const STARS = [
  { left: "6%", top: "14%", s: 2 }, { left: "18%", top: "32%", s: 1.5 }, { left: "27%", top: "10%", s: 2.5 },
  { left: "39%", top: "24%", s: 1.5 }, { left: "48%", top: "8%", s: 2 }, { left: "58%", top: "20%", s: 1.5 },
  { left: "67%", top: "12%", s: 2.5 }, { left: "78%", top: "28%", s: 1.5 }, { left: "88%", top: "16%", s: 2 },
  { left: "94%", top: "36%", s: 1.5 }, { left: "12%", top: "52%", s: 2 }, { left: "33%", top: "46%", s: 1.5 },
  { left: "52%", top: "40%", s: 2.5 }, { left: "72%", top: "50%", s: 1.5 }, { left: "84%", top: "44%", s: 2 },
  { left: "9%", top: "70%", s: 1.5 }, { left: "44%", top: "66%", s: 2 }, { left: "63%", top: "74%", s: 1.5 },
  { left: "82%", top: "68%", s: 2 }, { left: "23%", top: "80%", s: 1.5 },
];

export default function Finale() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          playSfx("swell");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nameChars = NAME.split("");

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-night-deep"
      style={{ "--accent": "var(--color-citrus)" } as React.CSSProperties}
    >
      {/* camera dolly: the whole scene settles toward the viewer on arrival */}
      <motion.div
        className="absolute inset-0 origin-center"
        initial={{ scale: 1.12 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* deep-night wash + CSS starfield fallback under the footage */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 118%, color-mix(in oklch, var(--color-dusk) 50%, transparent) 0%, var(--color-night) 48%, var(--color-night-deep) 100%)",
          }}
        />
        <div aria-hidden className="absolute inset-0">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="animate-torch absolute rounded-full bg-paper"
              style={{
                left: s.left,
                top: s.top,
                width: s.s,
                height: s.s,
                animationDelay: `${(i % 5) * 0.6}s`,
                animationDuration: "3.6s",
              }}
            />
          ))}
        </div>

        {/* full-screen fireworks footage (real HD). Poster paints instantly so
            there's never a blank frame while the file streams in. */}
        <video
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          poster="/images/finale-fireworks-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        >
          <source src="/videos/finale-night-fireworks.mp4" type="video/mp4" />
        </video>

        {/* subdue the fireworks so the type reads — dim the whole plate */}
        <div aria-hidden className="absolute inset-0 bg-night-deep/55" />

        <ColorGrade />

        {/* warm ambient bokeh, hero-grade depth */}
        <div aria-hidden className="animate-drift pointer-events-none absolute -left-32 top-10 h-[32rem] w-[32rem] rounded-full bg-grenadine/15 blur-3xl" />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-28 bottom-0 h-[30rem] w-[30rem] rounded-full bg-honey/15 blur-3xl"
          style={{ animationDelay: "-11s" }}
        />

        {/* centered spotlight scrim: darkens directly behind the title so the
            gold type has real contrast against the brightest fireworks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 46%, color-mix(in oklch, var(--color-night-deep) 82%, transparent) 0%, transparent 70%)",
          }}
        />

        <Vignette />

        {/* top edge blend: dissolves in from the night of the journey above */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-night-deep to-transparent" />

        {/* specular sweep across the whole scene */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[28] overflow-hidden">
          <div className="animate-light-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-paper/20 to-transparent blur-md" />
        </div>
      </motion.div>

      {/* targeting rings centered behind the title */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 opacity-70">
        <RingBack />
      </div>

      {/* vertical edition tag along the right edge (CineDaily "[2024]" move) */}
      <motion.div
        aria-hidden
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 md:block"
        style={{ writingMode: "vertical-rl" }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      >
        <span className="font-stamp text-[11px] tracking-[0.45em] text-honey/60">
          FIN &mdash; MMXXVI &mdash; LEO SEASON
        </span>
      </motion.div>

      {/* the grand curtain-call composition, filling the frame */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        variants={posterStage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* eyebrow with flanking rules — the credits-roll header */}
        <motion.div variants={rise()} className="flex items-center gap-3">
          <span className="h-px w-10 bg-honey/50" />
          <span className="font-stamp text-xs tracking-[0.4em] text-honey/80 md:text-sm">ROLL THE CREDITS ON</span>
          <span className="h-px w-10 bg-honey/50" />
        </motion.div>

        {/* colossal name — ghost echo behind, letter-mask rise in front, gold glow */}
        <div className="relative mt-4">
          <motion.span
            aria-hidden
            variants={ghostRise}
            className="font-poster pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(6rem,24vw,17rem)] leading-none text-transparent"
            style={{ WebkitTextStroke: "1.5px color-mix(in oklch, var(--color-citrus) 55%, transparent)" }}
          >
            {NAME}
          </motion.span>
          <div className="overflow-hidden pb-2">
            <motion.h2
              variants={letterGroup}
              className="font-poster inline-flex text-[clamp(3.25rem,15vw,10rem)] leading-[0.88] text-paper"
              style={{ textShadow: "0 0 38px color-mix(in oklch, var(--color-citrus) 55%, transparent), 0 8px 40px rgba(0,0,0,0.85)" }}
            >
              {nameChars.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span variants={letterRise} className="inline-block">
                    {ch}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>
        </div>

        {/* glam Didone line — the new Bodoni face, elegant counterpoint to Anton */}
        <motion.p variants={rise()} className="font-glam -mt-1 text-2xl italic text-citrus md:text-4xl">
          turns twenty&#8209;three
        </motion.p>

        {/* info coins row */}
        <motion.div variants={rise()} className="mt-7 flex items-center gap-4 md:gap-6">
          <Coin label="TURNS" value="23" filled />
          <Coin label="CAST" value={String(friends.length)} />
          <Coin label="SEASON" value="LEO" />
        </motion.div>

        {/* STARRING — the whole party, as end credits */}
        <motion.div variants={rise()} className="mt-9 max-w-2xl">
          <p className="font-stamp text-[11px] tracking-[0.4em] text-honey/70">STARRING</p>
          <p className="mt-2 font-stamp text-[11px] leading-relaxed tracking-[0.22em] text-paper/70 md:text-xs">
            {friends.map((f) => f.name.toUpperCase()).join("  ·  ")}
          </p>
        </motion.div>

        {/* heartfelt close — Playfair italic, the warm counterpoint */}
        <motion.p
          variants={rise()}
          className="mt-8 max-w-xl text-balance font-display text-xl italic leading-relaxed text-paper md:text-2xl"
        >
          Every person on this road chose to be here — for you, always. Happy 23rd, Priyanka.
        </motion.p>
      </motion.div>

      {/* kinetic band along the base, full width — the hero's counterpart */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-honey/25 py-2.5 backdrop-blur-sm"
        style={{ background: "color-mix(in oklch, var(--color-night-deep) 85%, transparent)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        aria-hidden
      >
        <div className="animate-marquee flex shrink-0 items-center gap-5 whitespace-nowrap pr-5">
          {Array.from({ length: 3 }).flatMap((_, dup) =>
            Array.from({ length: 4 }).map((__, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-5">
                <span className="font-poster text-lg text-citrus">HAPPY 23RD</span>
                <span className="text-xs text-honey/70">&#10022;</span>
                <span className="font-glam text-base italic text-paper/70">many happy returns</span>
                <span className="text-xs text-paper/30">&bull;</span>
              </span>
            )),
          )}
        </div>
      </motion.div>
    </section>
  );
}

function Coin({ label, value, filled }: { label: string; value: string; filled?: boolean }) {
  return (
    <div
      className="flex h-20 w-20 flex-col items-center justify-center rounded-full border backdrop-blur-md md:h-24 md:w-24"
      style={{
        borderColor: "color-mix(in oklch, var(--color-citrus) 60%, transparent)",
        background: filled
          ? "color-mix(in oklch, var(--color-citrus) 30%, var(--color-night-deep))"
          : "color-mix(in oklch, var(--color-night-deep) 72%, transparent)",
        boxShadow: filled ? "0 0 24px -6px color-mix(in oklch, var(--color-citrus) 60%, transparent)" : undefined,
      }}
    >
      <span className="font-stamp text-[9px] tracking-[0.25em] text-paper/70">{label}</span>
      <span className="font-poster text-2xl leading-none text-paper md:text-3xl">{value}</span>
    </div>
  );
}
