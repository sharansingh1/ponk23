"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import HeroVideo from "./hero/HeroVideo";
import HeroGlass from "./hero/HeroGlass";
import HeroCopy from "./hero/HeroCopy";
import HeroCast from "./hero/HeroCast";
import HeroMarquee from "./hero/HeroMarquee";
import OrbitBadge from "./hero/OrbitBadge";
import ColorGrade from "./fx/ColorGrade";
import Vignette from "./fx/Vignette";
import SunDisc from "./fx/SunDisc";
import { useCursorParallax } from "@/lib/useCursorParallax";
import { onRevealed } from "@/lib/gateSignal";

/**
 * The landing scene as a film poster (CineDaily language, tequila-sunrise
 * identity). Z-scale: 0 video / grade / vignette, 3 sun disc, 10 type,
 * 20 glass, 25 bokeh, 30 marquee + badge. Every plane moves at its own
 * speed under cursor and scroll.
 *
 * Hero mounts immediately underneath the D&D gate (so its scroll-trigger
 * has a real element to measure), but every pop-in entrance here waits
 * on the shared gate-reveal signal rather than its own mount time, or
 * they'd finish playing invisibly before the gate ever opens.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => onRevealed(() => setRevealed(true)), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 });

  const videoY = useTransform(progress, [0, 1], [0, 36]);
  const headlineX = useTransform(progress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(progress, [0, 0.55, 0.9], [1, 1, 0]);
  const discScale = useTransform(progress, [0, 1], [1, 1.15]);
  const discOpacity = useTransform(progress, [0, 0.7, 1], [1, 0.8, 0]);

  // The glass's scroll flight: surges toward the viewer, sweeps across
  // the screen, then tips and pours itself into the night below.
  const glassX = useTransform(progress, [0, 0.45, 1], ["0vw", "-26vw", "-58vw"]);
  const glassY = useTransform(progress, [0, 0.45, 1], ["0vh", "-4vh", "34vh"]);
  const glassRotate = useTransform(progress, [0, 0.4, 1], [0, -16, -140]);
  const glassScale = useTransform(progress, [0, 0.45, 1], [1, 1.3, 0.82]);
  const glassOpacity = useTransform(progress, [0, 0.8, 1], [1, 1, 0]);

  // One pointer listener; layers take different strengths for depth.
  const cursor = useCursorParallax(14, 5);
  const bokehX = useTransform(cursor.nx, (v) => v * 46);
  const bokehY = useTransform(cursor.ny, (v) => v * 30);
  const bokehXInv = useTransform(cursor.nx, (v) => v * -34);
  const bokehYInv = useTransform(cursor.ny, (v) => v * -22);
  const discX = useTransform(cursor.nx, (v) => v * -18);
  const discY = useTransform(cursor.ny, (v) => v * -12);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] w-full overflow-hidden bg-night">
      {/* camera dolly: the whole scene pushes toward the viewer as the
          gate reveals it (not at Hero's own mount time) */}
      <motion.div
        className="absolute inset-0 origin-center"
        initial={{ scale: 1.14 }}
        animate={revealed ? { scale: 1 } : undefined}
        transition={{ duration: 1.9, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* far plate: living footage with slow camera push */}
        <motion.div className="absolute inset-0" style={{ y: videoY }}>
          <HeroVideo />
        </motion.div>

        {/* film grade + lens vignette */}
        <ColorGrade />
        <Vignette />

        {/* the setting-sun disc: blooms open first, before anything else */}
        <motion.div
          className="absolute right-[-14%] top-1/2 z-[3] h-[92vmin] w-[92vmin] -translate-y-1/2 md:right-[-4%]"
          style={{ x: discX, y: discY, scale: discScale, opacity: discOpacity }}
        >
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
            animate={revealed ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
          >
            <SunDisc className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* cast credits row */}
        <motion.div
          className="absolute inset-x-0 top-[4.6rem] z-10 px-5 md:top-24 md:px-10"
          style={{ opacity: copyOpacity }}
        >
          <HeroCast />
        </motion.div>

        {/* type plane (headline sits under the glass, like a film poster) */}
        <HeroCopy headlineX={headlineX} scrollOpacity={copyOpacity} />

        {/* subject plane: the glass, occluding the name */}
        <HeroGlass
          revealed={revealed}
          x={cursor.x}
          y={cursor.y}
          rotateX={cursor.rotateX}
          rotateY={cursor.rotateY}
          scrollX={glassX}
          scrollY={glassY}
          scrollRotate={glassRotate}
          scrollScale={glassScale}
          scrollOpacity={glassOpacity}
        />

        {/* foreground bokeh: nearest plane, moves the most. Cursor motion on
            the outer wrapper, ambient drift on the inner. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-20 z-[25] h-[34rem] w-[34rem]"
          style={{ x: bokehX, y: bokehY }}
        >
          <div className="animate-drift h-full w-full rounded-full bg-grenadine/25 blur-3xl" />
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 z-[25] h-[30rem] w-[30rem]"
          style={{ x: bokehXInv, y: bokehYInv }}
        >
          <div
            className="animate-drift h-full w-full rounded-full bg-honey/20 blur-3xl"
            style={{ animationDelay: "-11s" }}
          />
        </motion.div>

        {/* kinetic band along the base: snaps up into place */}
        <motion.div
          className="absolute inset-x-[-2%] bottom-6 z-30"
          style={{ opacity: copyOpacity }}
          initial={{ opacity: 0, y: 90 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 }}
        >
          <HeroMarquee />
        </motion.div>

        {/* spinning stamp: slams down like a wax seal */}
        <motion.div
          className="absolute bottom-16 right-6 z-30 hidden h-36 w-36 md:block"
          style={{ opacity: copyOpacity }}
          initial={{ opacity: 0, scale: 2.2, rotate: -60 }}
          animate={revealed ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.65 }}
        >
          <OrbitBadge className="relative h-full w-full" />
        </motion.div>

        {/* vertical edition tag along the right edge — the CineDaily "[2024]"
            move: a bracketed masthead credit set on its side */}
        <motion.div
          aria-hidden
          className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block"
          style={{ opacity: copyOpacity, writingMode: "vertical-rl" }}
          initial={{ opacity: 0, y: 60 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
        >
          <span className="font-stamp text-[11px] tracking-[0.45em] text-honey/60">
            EST. MMIII &mdash; LEO SEASON
          </span>
        </motion.div>

        {/* specular light sweep that periodically crosses the whole scene */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[28] overflow-hidden">
          <div className="animate-light-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-paper/25 to-transparent blur-md" />
        </div>

        {/* edge blend: the scene dissolves into the night of the journey */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-32 bg-gradient-to-b from-transparent to-night"
        />
      </motion.div>
    </section>
  );
}
