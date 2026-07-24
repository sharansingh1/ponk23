"use client";

import { motion } from "motion/react";
import { INTERESTS, type WaypointId } from "@/lib/journey";
import { RingBack, duotone, posterStage, letterRise, letterGroup, rise, ghostRise } from "./poster";

/**
 * A passive interest "sprinkle": a kinetic title card you scroll *through*
 * (no button, no gate). Same poster language as the friend slots — giant
 * Anton word, bleeding ghost echo, targeting rings, duotone accent — so
 * her fandoms punctuate the journey without ever making the reader stop.
 */
export default function InterestPass({ id, index }: { id: WaypointId; index: number }) {
  const meta = INTERESTS[id];
  const swap = index % 2 === 1;
  const { accent, accentCool } = duotone(meta.t);
  const chars = meta.word.split("");

  return (
    <section
      className={`relative flex min-h-[78svh] items-center overflow-hidden px-6 py-16 ${
        swap ? "justify-center md:justify-end md:pr-24" : "justify-center md:justify-start md:pl-24"
      }`}
    >
      <motion.div
        className={`relative w-full max-w-xl ${swap ? "md:text-right" : "md:text-left"} text-center`}
        variants={posterStage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        style={{ "--accent": accent, "--accent-cool": accentCool } as React.CSSProperties}
      >
        {/* targeting rings behind */}
        <motion.div
          variants={rise(0)}
          aria-hidden
          className={`pointer-events-none absolute top-1/2 h-[150%] w-[150%] -translate-y-1/2 ${
            swap ? "right-[-25%]" : "left-[-25%]"
          }`}
        >
          <RingBack />
        </motion.div>

        {/* colossal ghost echo of the word, bleeding off-frame */}
        <motion.span
          aria-hidden
          variants={ghostRise}
          className={`font-poster pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(4.5rem,17vw,10rem)] leading-none text-transparent ${
            swap ? "right-[-6%]" : "left-[-6%]"
          }`}
          style={{ WebkitTextStroke: "1.5px color-mix(in oklch, var(--accent) 45%, transparent)" }}
        >
          {meta.word}
        </motion.span>

        <div className="relative z-10">
          {/* kicker + motif */}
          <motion.div
            variants={rise()}
            className={`flex items-center gap-3 ${swap ? "justify-center md:justify-end" : "justify-center md:justify-start"}`}
          >
            <span className="text-lg" style={{ color: "var(--accent)" }} aria-hidden>
              {meta.motif}
            </span>
            <span className="font-stamp text-[11px] tracking-[0.3em] text-paper/70">
              {meta.kicker.toUpperCase()}
            </span>
          </motion.div>

          {/* the word, letter-mask rise */}
          <div className={`mt-2 overflow-hidden pb-1 ${swap ? "md:text-right" : "md:text-left"} text-center`}>
            <motion.h2
              variants={letterGroup}
              className="font-poster inline-flex text-[clamp(2.75rem,10vw,6rem)] leading-[0.92] text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ color: "color-mix(in oklch, var(--accent) 30%, var(--color-paper))" }}
            >
              {chars.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span variants={letterRise} className="inline-block">
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          {/* flavor line — Playfair italic, the elegant counterpoint */}
          <motion.p
            variants={rise()}
            className={`mx-auto mt-3 max-w-sm font-display text-lg italic leading-relaxed text-paper/85 md:mx-0 ${
              swap ? "md:ml-auto" : ""
            }`}
          >
            {meta.flavor}
          </motion.p>

          {/* thin accent underline rule */}
          <motion.div
            variants={rise(10)}
            aria-hidden
            className={`mt-5 h-[2px] w-24 ${swap ? "mx-auto md:ml-auto md:mr-0" : "mx-auto md:mx-0"}`}
            style={{
              background: "linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent-cool) 70%, transparent))",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
