"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

export type CursorParallax = {
  /** Spring-smoothed cursor offset in [-1, 1] across the viewport. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** Ready-to-use translate values scaled by `strength` (px). */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Ready-to-use tilt values scaled by `tilt` (deg). */
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
};

/**
 * Cursor-driven depth. Values live entirely outside the React render
 * cycle (motion values + springs), so per-frame pointer movement never
 * re-renders the tree. On touch / coarse pointers the listener never
 * attaches and everything stays at zero.
 *
 * Different layers subscribe with different strengths to fake depth:
 * far plates barely move, near subjects move most.
 */
export function useCursorParallax(strength = 12, tilt = 6): CursorParallax {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 90, damping: 22, mass: 0.6 };
  const nx = useSpring(rawX, spring);
  const ny = useSpring(rawY, spring);

  const x = useTransform(nx, (v) => v * strength);
  const y = useTransform(ny, (v) => v * strength);
  const rotateY = useTransform(nx, (v) => v * tilt);
  const rotateX = useTransform(ny, (v) => v * -tilt);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return { nx, ny, x, y, rotateX, rotateY };
}
