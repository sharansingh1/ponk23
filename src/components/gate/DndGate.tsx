"use client";

import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import DragonSigil from "@/components/Journey/waypoints/DragonSigil";
import GateVideo from "./GateVideo";
import WhiteKeyVideo from "./WhiteKeyVideo";
import RuneInput from "./RuneInput";
import { playSfx } from "@/lib/audio";
import { markRevealed } from "@/lib/gateSignal";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "700", "900"] });

const STORAGE_KEY = "dnd-gate-unlocked";
const PASSWORD = "bund";

const REJECTIONS = [
  "The runes stay dark. Speak the true word.",
  "Silence answers you. Try again, traveler.",
  "The threshold does not yield. Once more.",
];

const EASE = [0.77, 0, 0.175, 1] as const;

// Fixed positions so server/client markup match (no Math.random at render).
const DUST = [
  { left: "12%", top: "20%", delay: 0, duration: 9 },
  { left: "78%", top: "65%", delay: 2, duration: 11 },
  { left: "34%", top: "80%", delay: 4, duration: 8 },
  { left: "58%", top: "15%", delay: 1.5, duration: 10 },
  { left: "88%", top: "30%", delay: 3.5, duration: 9.5 },
  { left: "22%", top: "55%", delay: 5, duration: 12 },
];

type Phase = "closed" | "locked" | "unlocking" | "open";

/**
 * The threshold: filmed stone archway behind, an actual parchment scroll
 * (real footage, white background keyed out live) unrolling in front.
 * The password prompt only fades in once the scroll finishes opening,
 * printed on the parchment like ink rather than floating UI chrome.
 * Unlocks once per browser (localStorage), then blooms golden light out
 * through the misty archway to reveal the sunset already playing behind.
 */
export default function DndGate() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [scrollOpen, setScrollOpen] = useState(false);
  const [value, setValue] = useState("");
  const [rejected, setRejected] = useState(false);
  const [rejectionLine, setRejectionLine] = useState(REJECTIONS[0]);

  useEffect(() => {
    // Reading localStorage must happen client-side post-mount (it doesn't
    // exist during SSR), so this genuinely can't be a lazy useState init
    // without causing a hydration mismatch.
    const known = window.localStorage.getItem(STORAGE_KEY);
    if (known) {
      markRevealed();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("open");
    } else {
      setPhase("locked");
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      setPhase("unlocking");
      playSfx("wax-seal");
      markRevealed();
      // Deterministic: doesn't depend on the exit animation ever
      // completing (a backgrounded tab pauses animation frames).
      window.setTimeout(finishUnlock, 1150);
      return;
    }
    setRejected(true);
    setRejectionLine(REJECTIONS[Math.floor(Math.random() * REJECTIONS.length)]);
    playSfx("dice");
    window.setTimeout(() => setRejected(false), 500);
  }

  function finishUnlock() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setPhase("open");
  }

  if (phase === "closed" || phase === "open") return null;

  return (
    <AnimatePresence onExitComplete={finishUnlock}>
      {phase === "locked" && (
        <motion.div
          className={`${cinzel.className} fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black`}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE } }}
        >
          <GateVideo />

          {/* golden light blooming outward through the misty opening on
              unlock — no doors to swing, so the light itself is the
              transition: walking from mist into the party beyond */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-citrus)_0%,var(--color-marigold)_45%,transparent_72%)]"
            initial={{ width: 40, height: 40, opacity: 0 }}
            exit={{ width: "260vmax", height: "260vmax", opacity: 1, transition: { duration: 1.05, ease: EASE } }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 200px 50px rgba(0,0,0,0.75)" }}
          />

          {DUST.map((d, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute h-[3px] w-[3px] rounded-full bg-honey/50"
              style={{
                left: d.left,
                top: d.top,
                animation: `ember-rise ${d.duration}s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}

          {/* the scroll: unrolls once, then hosts the prompt */}
          <motion.div
            className="relative z-10 w-full max-w-[380px] px-6"
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.45, ease: EASE } }}
          >
            <div className="relative">
              <WhiteKeyVideo
                src="/videos/gate-scroll.mp4"
                className="h-auto w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                onEnded={() => setScrollOpen(true)}
              />

              <AnimatePresence>
                {scrollOpen && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center px-10 py-8 text-center md:px-14"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <DragonSigil className="h-14 w-14 opacity-80" />

                    <h1 className="mt-3 text-2xl font-bold tracking-[0.05em] text-ink md:text-3xl">
                      THE THRESHOLD
                    </h1>

                    <div className="mt-2 flex items-center gap-2 text-ink/40">
                      <span className="h-px w-8 bg-ink/30" />
                      <span className="text-[10px] text-grenadine/70">&#10022;</span>
                      <span className="h-px w-8 bg-ink/30" />
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-ink/70 md:text-sm">
                      Only those who know the sacred word may cross into her twenty-third year.
                    </p>

                    <form onSubmit={submit} className="mt-6 flex w-full flex-col items-center">
                      <RuneInput value={value} onChange={setValue} length={4} shake={rejected} />

                      <button
                        type="submit"
                        className="press ease-premium relative mt-5 w-full max-w-[240px] overflow-hidden rounded-sm border border-ink/40 bg-ink/[0.06] py-2.5 text-xs tracking-[0.28em] text-ink transition-transform duration-150 hover:scale-[1.03] hover:bg-ink/10"
                      >
                        ENTER
                      </button>
                    </form>

                    <p
                      className={`mt-3 min-h-[1.3em] text-[11px] tracking-wide text-grenadine transition-opacity duration-300 ${
                        rejected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {rejectionLine}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
