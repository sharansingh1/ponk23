"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, type MotionValue } from "motion/react";
import GlowPool from "@/components/fx/GlowPool";

type HeroGlassProps = {
  revealed: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scrollX: MotionValue<string>;
  scrollY: MotionValue<string>;
  scrollRotate: MotionValue<number>;
  scrollScale: MotionValue<number>;
  scrollOpacity: MotionValue<number>;
};

/**
 * The subject plane: the tequila-sunrise glass floating free of the
 * footage. Three nested wrappers so nothing fights over transforms:
 * entrance (one-shot) -> scroll flight (sweep/tip/spin across the
 * screen) -> cursor springs (tilt toward the pointer) -> ambient bob.
 */
export default function HeroGlass({
  revealed,
  x,
  y,
  rotateX,
  rotateY,
  scrollX,
  scrollY,
  scrollRotate,
  scrollScale,
  scrollOpacity,
}: HeroGlassProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      initial={{ opacity: 0, scale: 0.5, y: 140 }}
      animate={revealed ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      {/* Light the glass casts into the scene; rides the same flight path. */}
      <motion.div className="absolute inset-0" style={{ x: scrollX, y: scrollY, opacity: scrollOpacity }}>
        <GlowPool color="var(--color-marigold)" size="64vmin" x="72%" y="62%" className="opacity-80" />
      </motion.div>

      {/* Scroll flight plane: sweeps across the screen, surges toward the
          viewer, then tips over as the journey begins. */}
      <motion.div
        className="absolute right-[16%] bottom-[2%] w-[42vmin] md:right-[22%] md:bottom-[4%] md:w-[52vmin] will-change-transform"
        style={{
          x: scrollX,
          y: scrollY,
          rotate: scrollRotate,
          scale: scrollScale,
          opacity: scrollOpacity,
        }}
      >
        {/* Cursor plane: spring tilt/drift, perspective for real depth. */}
        <motion.div style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}>
          <div className="animate-subject-bob">
            <img
              src="/images/hero-glass.webp"
              alt="A tequila sunrise cocktail"
              width={1037}
              height={1387}
              className="h-auto w-full drop-shadow-[0_28px_60px_rgba(120,30,10,0.55)]"
              draggable={false}
            />
            {/* Contact glow grounding the glass in the scene. */}
            <div
              aria-hidden
              className="absolute -bottom-6 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[100%] bg-grenadine/40 blur-2xl"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
