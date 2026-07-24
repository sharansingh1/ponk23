"use client";

import { useEffect, useState } from "react";
import { motion, type MotionValue, type Variants } from "motion/react";
import { onRevealed } from "@/lib/gateSignal";

type HeroCopyProps = {
  headlineX: MotionValue<number>;
  scrollOpacity: MotionValue<number>;
};

const NAME = "PRIYANKA";

/**
 * Poster-slam entrances: big travel, real overshoot, clearly visible.
 * A `pop` spring (bouncy) for most items, a heavier `slam` for stamps.
 * Everything is orchestrated through the parent's variants so the whole
 * plane starts together on mount (no long absolute delays that can
 * straddle a tab-visibility change and get fast-forwarded).
 */
const POP = { type: "spring", stiffness: 200, damping: 13, mass: 0.9 } as const;
const SLAM = { type: "spring", stiffness: 260, damping: 15 } as const;

// delayChildren gives the parchment tear (1.1s) time to actually open
// before anything pops, since the reveal signal fires the instant the
// tear starts, not once it finishes.
const plane: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.55, staggerChildren: 0.09 } },
};

const nameGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// Letters rise from behind a clip line (editorial mask reveal).
const letter: Variants = {
  hidden: { y: "115%", rotate: 6 },
  show: {
    y: "0%",
    rotate: 0,
    transition: { type: "spring", stiffness: 240, damping: 20, mass: 0.8 },
  },
};

const popUp: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 60 },
  show: { opacity: 1, scale: 1, y: 0, transition: POP },
};

const popDrop: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: -50 },
  show: { opacity: 1, scale: 1, y: 0, transition: POP },
};

const stamp: Variants = {
  hidden: { opacity: 0, scale: 2.2, rotate: -18 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: SLAM },
};

const ghost: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 0.4, x: 0, transition: { type: "spring", stiffness: 160, damping: 18 } },
};

// Glam masthead kicker: letters start wide and drift together, like a
// magazine cover line setting itself. Bodoni Moda — the new display face.
const glamKicker: Variants = {
  hidden: { opacity: 0, y: 16, letterSpacing: "0.4em" },
  show: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.06em",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

function scrollToJourney() {
  window.scrollTo({ top: window.innerHeight * 1.05, behavior: "smooth" });
}

export default function HeroCopy({ headlineX, scrollOpacity }: HeroCopyProps) {
  // Start once the client has painted, so the whole sequence fires on the
  // visible page in one go rather than during load/hydration.
  // Hold until the D&D gate actually reveals the scene, so the pops land
  // exactly on the tear rather than guessing at a fixed delay.
  const [ready, setReady] = useState(false);
  useEffect(() => onRevealed(() => setReady(true)), []);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col"
      style={{ opacity: scrollOpacity }}
      variants={plane}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      {/* top meta row: chips left, coins right */}
      <div className="flex items-start justify-between px-5 pt-6 md:px-10 md:pt-8">
        <motion.div variants={popDrop} className="flex gap-2">
          {["Tequila Sunrise", "Golden Hour"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-paper/25 bg-night-deep/30 px-3.5 py-1 font-stamp text-[10px] tracking-[0.22em] text-paper/85 backdrop-blur-md md:text-[11px]"
            >
              {chip.toUpperCase()}
            </span>
          ))}
        </motion.div>

        <div className="flex -space-x-2">
          <motion.span
            variants={stamp}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-honey font-stamp text-xl text-ink shadow-lg shadow-honey/30 md:h-14 md:w-14 md:text-2xl"
          >
            23
          </motion.span>
          <motion.span
            variants={stamp}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-honey/60 bg-night-deep/40 font-display text-xl italic text-citrus backdrop-blur-md md:h-14 md:w-14 md:text-2xl"
          >
            &#9804;
          </motion.span>
        </div>
      </div>

      {/* the name, spanning the frame, occluded by the glass */}
      <motion.div className="relative mt-auto select-none px-3 md:px-8" style={{ x: headlineX }}>
        <motion.p
          variants={glamKicker}
          className="font-glam mb-[-0.15em] pl-2 text-xl italic text-citrus/90 md:text-3xl"
        >
          the one &amp; only
        </motion.p>

        {/* ghost echo + name share their own relative box so the echo stays
            aligned to the name regardless of the kicker above */}
        <div className="relative">
          <motion.span
            aria-hidden
            variants={ghost}
            className="text-stroke-paper absolute -top-[0.12em] left-1 font-display text-[clamp(4.2rem,15.5vw,12.5rem)] font-[900] italic leading-[1.1] md:left-4"
          >
            {NAME}
          </motion.span>

          {/* One shared mask for the whole word (not per-letter) so an
              italic glyph's natural overhang into its neighbor's space
              never gets clipped at a per-character boundary. */}
          <div className="overflow-hidden pb-2 pl-1 pr-3 pt-[0.15em] -ml-1">
            <motion.h1
              variants={nameGroup}
              className="relative flex font-display text-[clamp(4.2rem,15.5vw,12.5rem)] font-[900] italic leading-[1.1] text-paper drop-shadow-[0_6px_30px_rgba(25,6,32,0.6)]"
            >
              {NAME.split("").map((ch, i) => (
                <motion.span key={i} variants={letter} className="inline-block">
                  {ch}
                </motion.span>
              ))}
            </motion.h1>
          </div>
        </div>
      </motion.div>

      {/* story block + the one CTA */}
      <div className="flex items-end justify-between gap-6 px-5 pb-24 pt-4 md:px-10 md:pb-28">
        <motion.p
          variants={popUp}
          className="max-w-xs font-body text-sm leading-relaxed text-paper/85 md:max-w-sm md:text-base"
        >
          The sun is setting on 22. Everyone she loves is already here.
        </motion.p>

        <motion.button
          variants={popUp}
          onClick={scrollToJourney}
          className="press ease-premium hidden shrink-0 items-center gap-3 rounded-full border border-honey/50 bg-night-deep/50 py-3 pl-6 pr-2 font-stamp text-sm tracking-[0.2em] text-honey backdrop-blur-md transition-transform duration-150 hover:scale-105 md:flex"
        >
          BEGIN THE NIGHT
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-honey text-ink">
            &darr;
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
