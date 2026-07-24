"use client";

import { type Variants } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Warm sunrise arc (DESIGN.md tokens) + cool counter-tone (dusk purple ->
// night blue), walked in parallel so any poster surface can pull a
// position-based duotone rather than one flat accent.
const WARM = ["grenadine", "coral", "marigold", "honey", "citrus"] as const;
const COOL = ["dusk", "dusk", "night", "night-deep", "night"] as const;

function rampColor(ramp: readonly string[], t: number): string {
  const steps = ramp.length - 1;
  const scaled = Math.min(1, Math.max(0, t)) * steps;
  const i = Math.min(steps - 1, Math.floor(scaled));
  const localT = Math.round((scaled - i) * 100);
  return `color-mix(in oklch, var(--color-${ramp[i + 1]}) ${localT}%, var(--color-${ramp[i]}))`;
}

/** Warm+cool duotone accent pair for position `t` in [0,1]. */
export function duotone(t: number): { accent: string; accentCool: string } {
  return { accent: rampColor(WARM, t), accentCool: rampColor(COOL, t) };
}

/** Concentric targeting rings — the CINE+DAILY instrument-circle motif.
 *  Reads `var(--accent)` from its container. */
export function RingBack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={`h-full w-full ${className}`} aria-hidden>
      <circle cx="300" cy="300" r="150" fill="none" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="1" />
      <circle cx="300" cy="300" r="230" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" />
      <g className="animate-spin-slower" style={{ transformOrigin: "300px 300px" }}>
        <circle
          cx="300"
          cy="300"
          r="285"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="2 22"
          strokeLinecap="round"
        />
      </g>
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="300"
          y1="42"
          x2="300"
          y2="66"
          stroke="var(--accent)"
          strokeOpacity="0.5"
          strokeWidth="2"
          transform={`rotate(${deg} 300 300)`}
        />
      ))}
    </svg>
  );
}

// Shared entrance variants for poster surfaces.
export const posterStage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const letterRise: Variants = {
  hidden: { y: "108%" },
  show: { y: "0%", transition: { type: "spring", stiffness: 240, damping: 22, mass: 0.8 } },
};

export const letterGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

export function rise(distance = 16): Variants {
  return {
    hidden: { opacity: 0, y: distance, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
  };
}

export const ghostRise: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 0.14, x: 0, transition: { duration: 1, ease: EASE_OUT } },
};
