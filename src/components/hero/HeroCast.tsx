"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { friends } from "@/lib/friends";
import { onRevealed } from "@/lib/gateSignal";

// delayChildren gives the parchment tear (1.1s) room to open before the
// row pops, since the reveal signal fires the instant the tear starts.
const row: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.65, staggerChildren: 0.06 } },
};

const credit: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: -22 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 14 },
  },
};

/**
 * The cast-credits row (CineDaily spreads the film's cast across the top;
 * here the cast is her people). Names come from the friends data so the
 * row updates itself when real names land. Each credit pops down with
 * overshoot, rapid-fire left to right, timed to the D&D gate's reveal.
 */
export default function HeroCast({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => onRevealed(() => setReady(true)), []);

  return (
    <motion.div
      className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 ${className}`}
      variants={row}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      {friends.map((friend) => (
        <motion.span
          key={friend.id}
          variants={credit}
          className="font-stamp text-[11px] tracking-[0.28em] text-paper/85 md:text-xs"
        >
          {friend.name.toUpperCase()}
        </motion.span>
      ))}
    </motion.div>
  );
}
