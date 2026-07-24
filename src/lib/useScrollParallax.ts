"use client";

import { useRef } from "react";
import { useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

export type ScrollParallax<T extends HTMLElement> = {
  /** Attach to the section being tracked. */
  ref: React.RefObject<T | null>;
  /** 0 at section fully below viewport -> 1 fully above. Spring-smoothed. */
  progress: MotionValue<number>;
  /** Translate-y in px, scaled by `distance`. Positive = lags behind scroll. */
  y: MotionValue<number>;
  /** Subtle scale-away as the section exits. */
  scale: MotionValue<number>;
  /** Fade as the section exits. */
  opacity: MotionValue<number>;
};

/**
 * Per-layer scroll speed. Give each depth plane a different `distance`
 * and the composition separates into real parallax as the user scrolls
 * away — near layers leave fastest.
 */
export function useScrollParallax<T extends HTMLElement>(
  distance = 80,
  scaleTo = 0.94,
): ScrollParallax<T> {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 });
  const y = useTransform(progress, [0, 1], [0, distance]);
  const scale = useTransform(progress, [0, 1], [1, scaleTo]);
  const opacity = useTransform(progress, [0, 0.65, 1], [1, 1, 0]);

  return { ref, progress, y, scale, opacity };
}
