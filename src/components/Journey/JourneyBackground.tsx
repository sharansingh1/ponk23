"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Vignette from "@/components/fx/Vignette";
import ColorGrade from "@/components/fx/ColorGrade";
import GlowPool from "@/components/fx/GlowPool";
import Motes from "@/components/fx/Motes";

gsap.registerPlugin(ScrollTrigger);

type JourneyBackgroundProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

// Fixed positions so server/client markup match (no Math.random at render),
// same pattern as the gate's dust field.
const STARS = [
  { left: "8%", top: "12%", size: 2, delay: 0 },
  { left: "22%", top: "28%", size: 1.5, delay: 0.6 },
  { left: "37%", top: "8%", size: 2.5, delay: 1.2 },
  { left: "51%", top: "22%", size: 1.5, delay: 0.3 },
  { left: "64%", top: "15%", size: 2, delay: 1.8 },
  { left: "78%", top: "30%", size: 1.5, delay: 0.9 },
  { left: "88%", top: "10%", size: 2, delay: 1.5 },
  { left: "14%", top: "45%", size: 1.5, delay: 2.1 },
  { left: "45%", top: "40%", size: 2.5, delay: 0.4 },
  { left: "70%", top: "48%", size: 1.5, delay: 1.1 },
  { left: "92%", top: "42%", size: 2, delay: 1.7 },
  { left: "5%", top: "62%", size: 2, delay: 0.7 },
  { left: "30%", top: "68%", size: 1.5, delay: 1.4 },
  { left: "58%", top: "64%", size: 2.5, delay: 0.2 },
  { left: "82%", top: "70%", size: 1.5, delay: 2.3 },
  { left: "18%", top: "85%", size: 2, delay: 1 },
  { left: "48%", top: "88%", size: 1.5, delay: 0.5 },
  { left: "74%", top: "92%", size: 2, delay: 1.9 },
];

/**
 * The journey's sky: pinned full-viewport layers (never resized by page
 * length) whose opacity crossfades across the whole scroll distance, so
 * more friends = a slower, more gradual sunrise-to-night transition, not
 * a stretched one. CSS gradients underneath are the load-bearing fallback
 * — real footage (once dropped into public/videos/journey-*.mp4) layers
 * on top for texture and motion but the color story reads correctly
 * before those assets exist.
 */
export default function JourneyBackground({ containerRef }: JourneyBackgroundProps) {
  const sunriseGradientRef = useRef<HTMLDivElement>(null);
  const duskGradientRef = useRef<HTMLDivElement>(null);
  const nightGradientRef = useRef<HTMLDivElement>(null);
  const sunriseVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dayMotesRef = useRef<HTMLDivElement>(null);
  const nightMotesRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sunLayers = [sunriseGradientRef.current, sunriseVideoRef.current, glowRef.current, dayMotesRef.current];
    const nightLayers = [nightGradientRef.current, nightVideoRef.current, nightMotesRef.current];

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        // Three real phases, not a two-layer dissolve: sunrise fully out
        // by the third, night fully in by the last third, and a dedicated
        // dusk layer (coral bleeding into purple) peaks in the middle —
        // so the page genuinely passes through a twilight moment instead
        // of just blending two unrelated colors together.
        gsap.set(sunLayers, { opacity: gsap.utils.clamp(0, 1, 1 - p / 0.4) });
        gsap.set(nightLayers, { opacity: gsap.utils.clamp(0, 1, (p - 0.6) / 0.4) });
        if (duskGradientRef.current) {
          const dusk = gsap.utils.clamp(0, 1, 1 - Math.abs(p - 0.45) / 0.35);
          gsap.set(duskGradientRef.current, { opacity: dusk });
        }
        if (starsRef.current) {
          gsap.set(starsRef.current, { opacity: gsap.utils.clamp(0, 1, (p - 0.5) / 0.35) });
        }
      },
    });

    return () => st.kill();
  }, [containerRef]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-deep">
      {/* sunrise layer */}
      <div
        ref={sunriseGradientRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-grenadine), var(--color-coral) 30%, var(--color-marigold) 55%, var(--color-honey) 78%, var(--color-citrus))",
        }}
      />
      <video
        ref={sunriseVideoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      >
        <source src="/videos/journey-sunrise-sky.mp4" type="video/mp4" />
      </video>

      {/* dusk layer: the actual orange-to-purple twilight bridge, peaks mid-scroll */}
      <div
        ref={duskGradientRef}
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-coral), var(--color-dusk) 45%, var(--color-night) 80%, var(--color-night-deep))",
        }}
      />

      {/* night layer */}
      <div
        ref={nightGradientRef}
        className="absolute inset-0 opacity-0"
        style={{
          background: "linear-gradient(to bottom, var(--color-dusk), var(--color-night) 55%, var(--color-night-deep))",
        }}
      />
      <video
        ref={nightVideoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      >
        <source src="/videos/journey-night-sky.mp4" type="video/mp4" />
      </video>

      {/* star field, fades in past the midpoint */}
      <div ref={starsRef} className="absolute inset-0 opacity-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute animate-torch rounded-full bg-paper"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: "3.4s",
            }}
          />
        ))}
      </div>

      <div ref={glowRef}>
        <GlowPool color="var(--color-marigold)" size="70vmin" x="50%" y="20%" />
      </div>
      <div ref={dayMotesRef}>
        <Motes density={0.1} color="oklch(0.85 0.14 85)" speed={0.6} />
      </div>
      <div ref={nightMotesRef} className="opacity-0">
        <Motes density={0.14} color="oklch(0.9 0.05 90)" speed={0.35} />
      </div>

      <ColorGrade />
      <Vignette />
    </div>
  );
}
