"use client";

import { motion, type Variants } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Friend } from "@/lib/friends";
import { EASE_OUT, RingBack, duotone, posterStage, letterRise as letter, letterGroup as nameGroup, rise, ghostRise as ghost } from "./poster";

const card = posterStage;

const stampPop: Variants = {
  hidden: { opacity: 0, scale: 1.7, rotate: -12 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16 } },
};

const imageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.9, ease: EASE_OUT } },
};

export default function FriendSlot({ friend, index, total }: { friend: Friend; index: number; total: number }) {
  const swap = index % 2 === 1;
  const t = total > 1 ? index / (total - 1) : 0;
  const { accent, accentCool } = duotone(t);
  const ordinal = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  const nameChars = friend.name.toUpperCase().split("");
  const isText = friend.type === "text";
  const actionLabel = friend.type === "video" ? "PRESS TO WATCH" : friend.type === "text" ? "A NOTE FOR HER" : "PRESS TO OPEN";
  const openLabel = friend.type === "video" ? "video" : "presentation";

  return (
    <section
      className={`relative flex min-h-[100svh] items-center overflow-hidden px-6 py-24 ${
        swap ? "justify-center md:justify-end md:pr-20" : "justify-center md:justify-start md:pl-20"
      }`}
    >
      <motion.div
        className="relative w-full max-w-2xl"
        variants={card}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        style={{ "--accent": accent, "--accent-cool": accentCool } as React.CSSProperties}
      >
        {/* Layer 0 — targeting rings, behind everything */}
        <motion.div
          variants={rise(0)}
          aria-hidden
          className={`pointer-events-none absolute top-1/2 h-[130%] w-[130%] -translate-y-1/2 ${
            swap ? "right-[-15%]" : "left-[-15%]"
          }`}
        >
          <RingBack />
        </motion.div>

        {/* Layer 1 — colossal ghost name bleeding off-frame */}
        <motion.span
          aria-hidden
          variants={ghost}
          className={`font-poster pointer-events-none absolute -top-8 whitespace-nowrap text-[clamp(5rem,18vw,11rem)] leading-none text-transparent md:-top-12 ${
            swap ? "right-[-8%]" : "left-[-8%]"
          }`}
          style={{ WebkitTextStroke: "1.5px color-mix(in oklch, var(--accent) 55%, transparent)" }}
        >
          {friend.name.toUpperCase()}
        </motion.span>

        {/* metadata: chapter marker, top corner */}
        <motion.div
          variants={rise()}
          className={`relative z-10 mb-3 flex items-center gap-3 ${swap ? "justify-end" : "justify-start"}`}
        >
          <span className="font-stamp text-[11px] tracking-[0.3em] text-paper/60">CHAPTER</span>
          <span className="font-poster text-2xl leading-none" style={{ color: "var(--accent)" }}>
            {ordinal}
          </span>
          <span className="h-px w-8" style={{ background: "color-mix(in oklch, var(--accent) 60%, transparent)" }} />
          <span className="font-stamp text-[11px] tracking-[0.3em] text-paper/40">{totalStr}</span>
        </motion.div>

        {/* Layer 2/3 — the poster body: bezel + thumbnail hero, name overlapping */}
        <div className="relative z-10">
          {/* the giant readable name, letter-mask rise, overlapping the top of the card */}
          <div className={`relative z-20 overflow-hidden pb-1 ${swap ? "text-right" : "text-left"}`}>
            <motion.h2
              variants={nameGroup}
              className="font-poster inline-flex text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.92] text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]"
            >
              {nameChars.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span variants={letter} className="inline-block">
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          {/* double-bezel thumbnail — the hero subject */}
          <div
            className="relative -mt-3 rounded-[1.6rem] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)]"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklch, var(--accent) 30%, transparent), color-mix(in oklch, var(--accent-cool) 45%, transparent))`,
            }}
          >
            <div
              className="group relative overflow-hidden rounded-[1.3rem] border shadow-2xl shadow-night-deep/70"
              style={{ borderColor: "color-mix(in oklch, var(--accent) 45%, transparent)" }}
            >
              {isText ? (
                <motion.div
                  variants={imageReveal}
                  className="relative flex min-h-[220px] flex-col gap-6 overflow-hidden bg-night-deep p-6 md:p-8"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
                    style={{
                      background: `linear-gradient(120deg, color-mix(in oklch, var(--accent) 60%, transparent), transparent 55%, color-mix(in oklch, var(--accent-cool) 70%, transparent))`,
                    }}
                  />
                  {friend.messages ? (
                    friend.messages.map((m, i) => (
                      <div
                        key={m.author}
                        className={`relative ${i > 0 ? "border-t pt-6" : ""}`}
                        style={i > 0 ? { borderColor: "color-mix(in oklch, var(--accent) 25%, transparent)" } : undefined}
                      >
                        <p className="font-poster whitespace-pre-line text-lg leading-snug text-paper md:text-xl">
                          &ldquo;{m.text}&rdquo;
                        </p>
                        <p className="mt-2 font-stamp text-[11px] tracking-[0.25em]" style={{ color: "var(--accent)" }}>
                          — {m.author.toUpperCase()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="font-poster relative whitespace-pre-line text-xl leading-snug text-paper md:text-2xl">
                      &ldquo;{friend.message}&rdquo;
                    </p>
                  )}
                  {friend.intro && (
                    <motion.p variants={rise()} className="relative flex items-start gap-2.5 text-sm leading-snug text-paper/70">
                      <span aria-hidden className="mt-0.5 h-4 w-[3px] shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      <span>{friend.intro}</span>
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <a
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: "var(--accent)" }}
                >
                  <motion.div variants={imageReveal} className="relative aspect-[16/10] overflow-hidden bg-night-deep">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={friend.thumbnail}
                      alt={`${friend.name}'s ${openLabel}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    {/* duotone wash: warm from one corner, cool from the other */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
                      style={{
                        background: `linear-gradient(120deg, color-mix(in oklch, var(--accent) 60%, transparent), transparent 55%, color-mix(in oklch, var(--accent-cool) 70%, transparent))`,
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-deep from-[6%] via-night-deep/45 via-40% to-transparent"
                    />
                    {/* hover accent ring */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ boxShadow: "inset 0 0 0 2px color-mix(in oklch, var(--accent) 75%, transparent)" }}
                    />

                    {/* intro pull-quote + open affordance, bottom */}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7">
                      {friend.intro && (
                        <motion.p
                          variants={rise()}
                          className="flex min-w-0 items-start gap-2.5 text-sm leading-snug text-paper/85"
                        >
                          <span
                            aria-hidden
                            className="mt-0.5 h-4 w-[3px] shrink-0 rounded-full"
                            style={{ background: "var(--accent)" }}
                          />
                          <span className="truncate">{friend.intro}</span>
                        </motion.p>
                      )}

                      <motion.span
                        variants={stampPop}
                        aria-hidden
                        className="press ease-premium flex h-12 w-12 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        style={{
                          borderColor: "color-mix(in oklch, var(--accent) 60%, transparent)",
                          background: "color-mix(in oklch, var(--accent) 24%, transparent)",
                        }}
                      >
                        <ArrowUpRight weight="bold" className="h-5 w-5" style={{ color: "var(--accent)" }} />
                      </motion.span>
                    </div>
                  </motion.div>
                  <span className="sr-only">View {friend.name}&rsquo;s {openLabel} (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>

          {friend.url2 && (
            <div className={`relative z-10 mt-2 flex ${swap ? "justify-end" : "justify-start"}`}>
              <a
                href={friend.url2}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-stamp tracking-[0.2em] text-paper/80 backdrop-blur-md transition-colors hover:text-paper"
                style={{
                  borderColor: "color-mix(in oklch, var(--accent) 60%, transparent)",
                  background: "color-mix(in oklch, var(--accent) 18%, transparent)",
                }}
              >
                PART TWO
                <ArrowUpRight weight="bold" className="h-3 w-3" style={{ color: "var(--accent)" }} />
              </a>
            </div>
          )}

          {/* Layer 4 — ticker band under the card */}
          <motion.div
            variants={rise()}
            aria-hidden
            className="relative z-10 mt-3 flex items-center overflow-hidden rounded-full py-1.5"
            style={{ background: "color-mix(in oklch, var(--accent) 22%, var(--color-night-deep))" }}
          >
            <div className="animate-marquee flex shrink-0 items-center gap-4 whitespace-nowrap pr-4">
              {Array.from({ length: 2 }).flatMap((_, dup) =>
                Array.from({ length: 6 }).map((__, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-4">
                    <span className="font-stamp text-[10px] tracking-[0.3em] text-paper/80">
                      {actionLabel}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--accent)" }}>
                      &#10022;
                    </span>
                    <span className="font-stamp text-[10px] tracking-[0.3em] text-paper/50">
                      NO.&nbsp;{ordinal}
                    </span>
                    <span className="text-[10px] text-paper/30">&bull;</span>
                  </span>
                )),
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
